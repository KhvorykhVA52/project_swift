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

  async createTeam(ownerId: number, createTeamDto: CreateTeamDto) {
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['ownedTeams']
    });
    if (!owner) throw new NotFoundException(`ERROR: teams.service.createTeam(): не удалось найти User при ownerId=${ownerId}`);

    if (owner.ownedTeams && owner.ownedTeams.length > 1) {
      console.log(`ERROR: teams.service.createTeam(): превышение лимита на User.ownedTeams[] при ownerId=${ownerId}`);
      return;
    }
    
    const team = new Team();
    team.name = createTeamDto.name;
    if (createTeamDto.description){
      team.description = createTeamDto.description;
    }
    team.owner = owner;
    team.members = [owner];


    const savedTeam = await this.teamRepository.save(team);

    // Обновляем связь у владельца
    owner.ownedTeams.push(savedTeam);
    await this.userRepository.save(owner);

    console.log(`OK: teams.service.createTeam(ownerId=${ownerId}, createTeamDto={name=${createTeamDto.name}, description=${createTeamDto.description}})`);
  }

  async createInvite(inviterId: number, dto: CreateInviteDto) {
    console.log(dto.inviteeId);
    const [inviter, invitee, team] = await Promise.all([
      this.userRepository.findOneBy({ id: inviterId }),
      this.userRepository.findOneBy({ id: dto.inviteeId }),
      this.teamRepository.findOne({
        where: { id: dto.teamId },
        relations: ['members']
      }),
    ]);

    if (!inviter || !invitee || !team) {
      return 'ERROR1';
      throw new NotFoundException(`ERROR: teams.service.createInvite(): не удалось найти данный User или Team при intiretId=${inviterId}, dto={inviteeId=${dto.inviteeId}, teamId=${dto.teamId}}`);
    }

    if (team.members.some(m => m.id === dto.inviteeId)) {
      return 'ERROR2';
      throw new InternalServerErrorException(`ERROR: teams.service.createInvite(): данный User уже в в чьей-то команде. inviterId=${inviterId}, dto={inviteeId=${dto.inviteeId}, teamId=${dto.teamId}}`);
    }

    const existingInvite = await this.inviteRepository.findOne({
      where: {
        invitee: { id: dto.inviteeId },
        team: { id: dto.teamId },
        status: InviteStatus.PENDING
      }
    });

    if (existingInvite) {
      return 'ERROR3';
      //throw new InternalServerErrorException(`ERROR: teams.service.createInvite(): уже существует Invite при invitee=${invitee}, teamId=${dto.teamId}`);
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

    console.log(`OK: teams.service.createInvite(inviterId=${inviterId}, dto={inviteeId=${dto.inviteeId}, dto.teamId=${dto.teamId})`);

    return 'OK';
  }

  async respondToInvite(inviteId: number, userId: number, accept: boolean): Promise<Team> {
    const teamInvite = await this.inviteRepository.findOne({
      where: { id: inviteId, invitee: { id: userId } },
      relations: ['team', 'team.members', 'inviter', 'invitee']
    });
  
    if (!teamInvite) {
      throw new NotFoundException(`ERROR: teams.service.respontToInvite(): не удалось найти Invite при inviteId=${inviteId}, inviteeId=${userId}`);
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
      throw new NotFoundException(`ERROR: teams.service.respondToInvite(): не удалось найти Team при id=${teamInvite.team.id}`);
    }
  
    console.log(`OK: teams.service.respondToInvite(inviteId=${inviteId}, userId=${userId}), accept=${accept}`);
    return updatedTeam;
  }

  async getUserInvites(userId: number): Promise<TeamInvite[]> {
    return this.inviteRepository.find({
      where: { invitee: { id: userId }, status: InviteStatus.PENDING },
      relations: ['team', 'inviter']
    });
    console.log(`OK: teams.service.getUserInvites(userId=${userId})`);
  }

  async getUserTeamInvites(userId: number): Promise<UserTeamInvite[]> {
    return this.userTeamInviteRepository.find({
      where: { invitee: { id: userId }, status: 'pending' },
      relations: ['team', 'inviter']
    });
    console.log(`OK: teams.service.getUserTeamInvites(userId=${userId})`);
  }

  async getTeamMembers(teamId: number): Promise<User[]> {
    try {
      const team = await this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['members']
      });
      return team?.members || [];
    } catch (error) {
      console.error('ERROR: teams.service.getTeamMembers(): ', error);
      throw new InternalServerErrorException(`ERROR: teams.service.getTeamMembers: не удалось найти Team при teamId=${teamId}`);
    }
    console.log(`OK: teams.service.getTeamMembers(teamId=${teamId})`);
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
      throw new NotFoundException('ERROR: teams.service.inviteCancel(): не удалось найти TeamInvite при inviter=${input.inviterId}, invitee=${input.inviterId}, teamId=${input.teamId}');
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
      throw new NotFoundException(`ERROR: teams.service.inviteCancel(): не удалось найти userTeamInvite при inviter=${input.inviterId}, invitee=${input.inviterId}, teamId=${input.teamId}`);
    }

    await this.inviteRepository.remove(teamInvite);
    await this.userTeamInviteRepository.remove(userTeamInvite);

    console.log(`OK: teams.service.userTeamInvite(inviterId=${input.inviterId}, inviteeId=${input.inviteeId}, teamId=${input.teamId})`);

  }

  async memberRemove(input: MemberRemoveDto) {
    const user = await this.userRepository.findOne({ where: { id: input.memberId } });
    const team = await this.teamRepository.findOne({ where: { id: input.teamId }, relations: ['leader', 'members'] }); // Загружаем leader и members

    if (!user) {
      throw new InternalServerErrorException(`ERROR: teams.service.memberRemove(): не удалось найти User при memberId=${input.memberId}`);
    }

    if (!team) {
      throw new InternalServerErrorException(`ERROR: teams.service.inviteCancel(): не удалось найти Team при teamId=${input.teamId}`);
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

    console.log(`OK: teams.service.memberRemove(User.id=${input.memberId}, Team.id=${input.teamId})`);
  }

  async changeTeamleader(input: ChangeTeamleaderDto) {
    // 1. Находим команду по ID.
    const team = await this.teamRepository.findOne({
      where: { id: input.teamId },
      relations: ['leader'], // Загружаем текущего лидера (если есть)
    });

    if (!team) {
      throw new InternalServerErrorException(`ERROR: teams.service.changeTeamleader(): не удалось найти Team при teamId=${input.teamId}`);
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
        throw new InternalServerErrorException(`ERROR: teams.service.changeTeamleader(): не удалось найти User при userId=${input.memberId}`);
      }

      // 4. Проверяем, не является ли этот пользователь уже лидером другой команды.
      if (newLeader.ledTeam) {
        throw new InternalServerErrorException(`ERROR: teams.service.changeTeamleader(): User с userId=${input.memberId} уже является лидером другой команды`);
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
    console.log(`OK: changeTeamleader(Team.id=${input.teamId}, User.id=${input.memberId}`);
  }

  async changeTeamInfo(input: ChangeTeamInfoDto) {
    const team = await this.teamRepository.findOneBy({ id: input.teamId });

    if (!team) {
      throw new InternalServerErrorException(`ERROR: teams.service.changeTeamInfo(): Team с Team.id = ${input.teamId} не найдена`);
    }

    team.name = input.name;
    team.description = input.description;

    console.log(`OK: teams.service.changeTeamInfo(teamId=${input.teamId}, name=${input.name}, description=${input.description})`);

    return this.teamRepository.save(team);
  }

  async getTeams(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['ownedTeams', 'ownedTeams.members', 'ownedTeams.leader', 'ownedTeams.owner'],
    });

    if (!user) {
      throw new InternalServerErrorException(`ERROR: teams.service.getTeams(): не удалось найти User.ownedTeams при User.id=${id}`);
    }
    
    console.log(`OK: teams.service.getTeams(User.id=${id})`);
    return user.ownedTeams;
  }
}
