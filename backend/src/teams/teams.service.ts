import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../orm/team.entity';
import { User } from '../orm/user.entity';
import { TeamInvite, InviteStatus } from '../orm/team-invite.entity';
import { UserTeamInvite } from '../orm/user-team-invite.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InviteCancelDto } from './dto/invite-cancel.dto';
import { MemberRemoveDto } from './dto/member-remove.dto';
import { ChangeTeamleaderDto } from './dto/change-teamleader.dto';
import { ChangeTeamInfoDto } from './dto/change-team-info.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TeamInvite)
    private inviteRepository: Repository<TeamInvite>,
    @InjectRepository(UserTeamInvite)
    private userTeamInviteRepository: Repository<UserTeamInvite>,
  ) {}

  async createTeam(ownerId: number, createTeamDto: CreateTeamDto): Promise<Team> {
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['ownedTeams']
    });
    if (!owner) throw new NotFoundException('Owner not found');

    const team = this.teamRepository.create({
      ...createTeamDto,
      owner,
      members: [owner]
    });

    const savedTeam = await this.teamRepository.save(team);

    // Обновляем связь у владельца
    owner.ownedTeams.push(savedTeam);
    await this.userRepository.save(owner);

    return savedTeam;
  }

  async createInvite(inviterId: number, dto: CreateInviteDto): Promise<{
    teamInvite: TeamInvite,
    userTeamInvite: UserTeamInvite
  }> {
    const [inviter, invitee, team] = await Promise.all([
      this.userRepository.findOneBy({ id: inviterId }),
      this.userRepository.findOneBy({ id: dto.inviteeId }),
      this.teamRepository.findOne({
        where: { id: dto.teamId },
        relations: ['members']
      }),
    ]);

    if (!inviter || !invitee || !team) {
      throw new NotFoundException('User or team not found');
    }

    if (team.members.some(m => m.id === dto.inviteeId)) {
      throw new Error('User already in team');
    }

    const existingInvite = await this.inviteRepository.findOne({
      where: {
        invitee: { id: dto.inviteeId },
        team: { id: dto.teamId },
        status: InviteStatus.PENDING
      }
    });

    if (existingInvite) {
      throw new Error('Pending invite already exists');
    }

    const teamInvite = await this.inviteRepository.save(
      this.inviteRepository.create({
        inviter,
        invitee,
        team,
        status: InviteStatus.PENDING
      })
    );

    const userTeamInvite = await this.userTeamInviteRepository.save(
      this.userTeamInviteRepository.create({
        inviter,
        invitee,
        team,
        status: 'pending'
      })
    );

    return { teamInvite, userTeamInvite };
  }

  async respondToInvite(inviteId: number, userId: number, accept: boolean): Promise<Team> {
    const teamInvite = await this.inviteRepository.findOne({
      where: { id: inviteId, invitee: { id: userId } },
      relations: ['team', 'team.members', 'inviter', 'invitee']
    });
  
    if (!teamInvite) {
      throw new NotFoundException('Invite not found');
    }
  
    // Обновляем статус приглашения
    teamInvite.status = accept ? InviteStatus.ACCEPTED : InviteStatus.REJECTED;
    await this.inviteRepository.save(teamInvite);
  
    // Обновляем UserTeamInvite
    const userTeamInvite = await this.userTeamInviteRepository.findOne({
      where: {
        inviter: { id: teamInvite.inviter.id },
        invitee: { id: userId },
        team: { id: teamInvite.team.id }
      }
    });
  
    if (userTeamInvite) {
      userTeamInvite.status = accept ? 'accepted' : 'rejected';
      await this.userTeamInviteRepository.save(userTeamInvite);
    }
  
    if (accept) {
      // Проверяем, что пользователь еще не в команде
      if (!teamInvite.team.members.some(m => m.id === userId)) {
        // Добавляем пользователя в команду
        teamInvite.team.members.push(teamInvite.invitee);
        await this.teamRepository.save(teamInvite.team);
  
        // Обновляем связь у пользователя
        teamInvite.invitee.team = teamInvite.team;
        await this.userRepository.save(teamInvite.invitee);
      }
    }
  
    // Возвращаем обновленную команду
    const updatedTeam = await this.teamRepository.findOne({
      where: { id: teamInvite.team.id },
      relations: ['members']
    });
  
    if (!updatedTeam) {
      throw new NotFoundException('Team not found after update');
    }
  
    return updatedTeam;
  }

  async getUserInvites(userId: number): Promise<TeamInvite[]> {
    return this.inviteRepository.find({
      where: { invitee: { id: userId }, status: InviteStatus.PENDING },
      relations: ['team', 'inviter']
    });
  }

  async getUserTeamInvites(userId: number): Promise<UserTeamInvite[]> {
    return this.userTeamInviteRepository.find({
      where: { invitee: { id: userId }, status: 'pending' },
      relations: ['team', 'inviter']
    });
  }

  async getTeamMembers(teamId: number): Promise<User[]> {
    try {
      const team = await this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['members']
      });
      return team?.members || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new InternalServerErrorException('Error fetching team members');
    }
  }

  async inviteCancel(input: InviteCancelDto) {

    const teamInvite = await this.inviteRepository.findOne({
      where: {
        inviter: { id: input.inviterId },
        invitee: { id: input.inviteeId },
        team: { id: input.teamId },
      },
      relations: ['inviter', 'invitee', 'team'],
    });

    if (!teamInvite) {
      throw new NotFoundException('Invite not found');
    }

    const userTeamInvite = await this.userTeamInviteRepository.findOne({
      where: {
        inviter: { id: input.inviterId },
        invitee: { id: input.inviteeId },
        team: { id: input.teamId },
      },
      relations: ['inviter', 'invitee', 'team'],
    });

    if (!userTeamInvite) {
      throw new NotFoundException('User team invite not found');
    }

    await this.inviteRepository.remove(teamInvite);
    await this.userTeamInviteRepository.remove(userTeamInvite);

    console.log(`Removed TeamInvite and UserTeamInvite. inviterId: ${input.inviterId}; inviteeId: ${input.inviteeId}; teamId: ${input.teamId}`);

  }

  async memberRemove(input: MemberRemoveDto) {
    const user = await this.userRepository.findOne({ where: { id: input.memberId } });
    const team = await this.teamRepository.findOne({ where: { id: input.teamId }, relations: ['leader', 'members'] }); // Загружаем leader и members

    if (!user) {
      throw new Error(`User with ID ${input.memberId} not found.`);
    }

    if (!team) {
      throw new Error(`Team with ID ${input.teamId} not found.`);
    }

    // 2. Проверяем, является ли пользователь лидером команды, и если да, обнуляем leader.
    if (team.leader && team.leader.id === input.memberId) {
      team.leader = null;
    }

    // 3. Удаляем пользователя из списка members.
    team.members = team.members.filter(member => member.id !== input.memberId);

    // 4. Обнуляем team у пользователя.
    user.team = null;

    // 5. Сохраняем изменения в базе данных. Сначала сохраняем команду, потом пользователя.
    await this.teamRepository.save(team);
    await this.userRepository.save(user);

    console.log(`Remove User: User.id = ${input.memberId} from Team: Team.id = ${input.teamId}`);
  }

  async changeTeamleader(input: ChangeTeamleaderDto) {
    // 1. Находим команду по ID.
    const team = await this.teamRepository.findOne({
      where: { id: input.teamId },
      relations: ['leader'], // Загружаем текущего лидера (если есть)
    });

    if (!team) {
      throw new Error(`Команда с id = ${input.teamId} не найдена`);
    }

    // 2. Обрабатываем случай удаления текущего лидера.
    if (input.memberId === -1) {
      if (team.leader) {
        // Сбрасываем ledTeam у текущего лидера
        const oldLeader = team.leader;
        oldLeader.ledTeam = null;
        await this.userRepository.save(oldLeader);

        team.leader = null; // Удаляем лидера у команды
      }
    } else {
      // 3. Находим нового лидера по ID.
      const newLeader = await this.userRepository.findOne({
        where: { id: input.memberId },
      });

      if (!newLeader) {
        throw new Error(`User с id = ${input.memberId} не найден`);
      }

      // 4. Проверяем, не является ли этот пользователь уже лидером другой команды.
      if (newLeader.ledTeam) {
        throw new Error(`User с id = ${input.memberId} уже является лидером другой команды`);
      }
            
      // 5.  Если у команды уже есть лидер, сбрасываем его.
      if (team.leader) {
        const oldLeader = team.leader;
        oldLeader.ledTeam = null;
        await this.userRepository.save(oldLeader);
      }

      // 6. Назначаем нового лидера.
      team.leader = newLeader;
      newLeader.ledTeam = team;

      await this.userRepository.save(newLeader);  //Сохраняем нового лидера, чтобы обновить связь ledTeam
    }

    // 7. Сохраняем изменения в команде.
    await this.teamRepository.save(team);

    if (input.teamId == -1) {
      console.log(`Изменён leader в Team где Team.id = ${input.teamId} на null (Больше нет leader)`);
    } else {
      console.log(`Изменён leader в Team где Team.id = ${input.teamId} на User с User.id = ${input.memberId}`);
    }
  }

  async changeTeamInfo(input: ChangeTeamInfoDto) {
    const team = await this.teamRepository.findOneBy({ id: input.teamId });

    if (!team) {
      throw new Error(`Error: changeTeamInfo: Team с Team.id = ${input.teamId} не найдена`);
    }

    team.name = input.name;
    team.description = input.description;

    console.log(`changeTeamInfo: DONE: teamId=${input.teamId} name=${input.name} description=${input.description}`);

    return this.teamRepository.save(team);
  }

  async getTeams(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['ownedTeams', 'ownedTeams.members'],
    });

    if (!user) {
      throw new Error(`Error: getTeams: не получилось найти User.ownedTeams при User.id=${id}`);
    }
    
    return user.ownedTeams;
  }
}
