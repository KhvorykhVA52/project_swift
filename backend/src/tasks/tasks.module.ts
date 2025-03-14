import { Module } from '@nestjs/common';

import { TasksService } from './tasks.service';

import { TasksController } from './tasks.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from 'src/orm/task.entity';

import { UsersService } from 'src/users/users.service';

import { User } from 'src/orm/user.entity';

 

@Module({

  imports: [TypeOrmModule.forFeature([Task, User])],

  controllers: [TasksController],

  providers: [TasksService, UsersService],

})

export class TasksModule {}
