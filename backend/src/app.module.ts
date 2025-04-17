import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectModule } from './tasks/project.module';
import { User } from './orm/user.entity';
import { Team } from './orm/team.entity';
import { TeamInvite } from './orm/team-invite.entity';
import { UserTeamInvite } from './orm/user-team-invite.entity';
import { Idea } from './orm/idea.entity';
import { Portfolio } from './orm/portfolio.entity';
import { Project } from './orm/project.entity';
import { Comments } from './orm/comment.entity';
import { Task } from './orm/task.entity';
import { TeamsModule } from './teams/teams.module';
import { IdeaModule } from './idea/idea.module';
import {CommentModule } from './comments/comment.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProjectModule,
    TeamsModule,
    CommentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          Team,
          TeamInvite,
          UserTeamInvite,
          Comments,
          Idea,
          Portfolio,
          Project,
          Task
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    IdeaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}