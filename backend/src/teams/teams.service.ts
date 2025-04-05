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
    try {
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

      // Проверка что пользователь уже не в команде
      if (team.members.some(m => m.id === dto.inviteeId)) {
        throw new Error('User already in team');
      }

      // Проверка существующих приглашений
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

      // Создаем основное приглашение
      const teamInvite = await this.inviteRepository.save(
        this.inviteRepository.create({
          inviter,
          invitee,
          team,
          status: InviteStatus.PENDING
        })
      );

      // Создаем запись в истории
      const userTeamInvite = await this.userTeamInviteRepository.save(
        this.userTeamInviteRepository.create({
          inviter,
          invitee,
          team,
          status: 'pending'
        })
      );

      return { teamInvite, userTeamInvite };
    } catch (error) {
      console.error('Error creating invite:', error);
      throw new InternalServerErrorException('Error creating invite');
    }
  }

  async respondToInvite(inviteId: number, userId: number, accept: boolean): Promise<Team> {
    try {

      const teamInvite = await this.inviteRepository.findOne({
        where: { id: inviteId, invitee: { id: userId } },
        relations: ['team', 'invitee', 'team.members']
      });

      if (!teamInvite) {
        throw new NotFoundException('Invite not found');
      }

      const userTeamInvite = await this.userTeamInviteRepository.findOne({
        where: { invitee: { id: userId }, team: { id: teamInvite.team.id } }
      });

      if (!userTeamInvite) {
        throw new NotFoundException('User team invite not found');
      }

      if (accept) {
        // Добавляем пользователя в команду
        if (!teamInvite.team.members.some(m => m.id === userId)) {
          teamInvite.team.members.push(teamInvite.invitee);
          await this.teamRepository.save(teamInvite.team);
        }

        // Устанавливаем команду пользователю
        teamInvite.invitee.team = teamInvite.team;
        await this.userRepository.save(teamInvite.invitee);
      }

      // Обновляем статусы
      teamInvite.status = accept ? InviteStatus.ACCEPTED : InviteStatus.REJECTED;
      userTeamInvite.status = accept ? 'accepted' : 'rejected';

      await Promise.all([
        this.inviteRepository.save(teamInvite),
        this.userTeamInviteRepository.save(userTeamInvite)
      ]);

      return teamInvite.team;
    } catch (error) {
      console.error('Error responding to invite:', error);
      throw new InternalServerErrorException('Error responding to invite');
    }
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
    console.log(`Removed TeamInvite and UserTeamInvite. inviterId: ${input.inviterId}; inviteeId: ${input.inviteeId}; teamId: ${input.teamId}`);

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
}
