import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from 'src/orm/project.entity';
import { Idea } from 'src/orm/idea.entity';
import { User } from 'src/orm/user.entity';
import { Team } from 'src/orm/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Idea, User, Team])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
