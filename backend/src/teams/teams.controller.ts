import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';
import { Team } from '../orm/team.entity';
import { TeamInvite } from '../orm/team-invite.entity';
import { UserTeamInvite } from '../orm/user-team-invite.entity';
import { User } from '../orm/user.entity';
import { InviteCancelDto } from './dto/invite-cancel.dto';
import { MemberRemoveDto } from './dto/member-remove.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  createTeam(
    @Body('ownerId') ownerId: number,
    @Body() createTeamDto: CreateTeamDto
  ): Promise<Team> {
    return this.teamsService.createTeam(ownerId, createTeamDto);
  }

  @Post('invite')
  createInvite(
    @Body('inviterId') inviterId: number,
    @Body() dto: CreateInviteDto
  ): Promise<{teamInvite: TeamInvite, userTeamInvite: UserTeamInvite}> {
    return this.teamsService.createInvite(inviterId, dto);
  }

  @Put('invite/respond/:id')
  respondToInvite(
    @Param('id') inviteId: string,
    @Body() dto: RespondInviteDto
  ): Promise<Team> {
    return this.teamsService.respondToInvite(
      +inviteId,
      dto.userId,
      dto.accept
    );
  }

  @Get('user/invites/:userId')
  getUserInvites(@Param('userId') userId: string): Promise<TeamInvite[]> {
    return this.teamsService.getUserInvites(+userId);
  }

  @Get('user/team-invites/:userId')
  getUserTeamInvites(@Param('userId') userId: string): Promise<UserTeamInvite[]> {
    return this.teamsService.getUserTeamInvites(+userId);
  }

  @Get('members/:teamId')
  getTeamMembers(@Param('teamId') teamId: string): Promise<User[]> {
    return this.teamsService.getTeamMembers(+teamId);
  }

  @Post('invite/cancel')
  inviteCancel(@Body() body: InviteCancelDto) {
    return this.teamsService.inviteCancel(body);
  }

  @Post('memberremove')
  memberRemove(@Body() body: MemberRemoveDto) {
    return this.teamsService.memberRemove(body);
  }
}
