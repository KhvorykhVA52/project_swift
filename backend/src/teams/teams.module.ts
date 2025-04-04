import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../orm/team.entity';
import { TeamInvite } from '../orm/team-invite.entity';
import { User } from '../orm/user.entity';
import { UserTeamInvite } from '../orm/user-team-invite.entity'; // Импортируем UserTeamInvite
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamInvite, User, UserTeamInvite])], // Добавляем UserTeamInvite
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
