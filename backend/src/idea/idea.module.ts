import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { Idea } from 'src/orm/idea.entity';
import { User } from 'src/orm/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaInvite } from 'src/orm/idea-invite.entity';
import { Team } from 'src/orm/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User, IdeaInvite, Team])],
  controllers: [IdeaController],
  providers: [IdeaService]
})
export class IdeaModule {}
