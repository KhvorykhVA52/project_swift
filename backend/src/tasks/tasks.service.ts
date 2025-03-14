import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { CreateUpdateTaskDto } from 'src/common/types';

import { Task } from 'src/orm/task.entity';

import { User } from 'src/orm/user.entity';

import { UsersService } from 'src/users/users.service';

import { Repository } from 'typeorm';

 

@Injectable()

export class TasksService {

  private readonly logger = new Logger(TasksService.name);

  constructor(

    @InjectRepository(User)

    private readonly userRepository: Repository<User>,

    @InjectRepository(Task)

    private readonly taskRepository: Repository<Task>,

    private readonly usersService: UsersService,

  ) {}

  async create(createTaskDto: CreateUpdateTaskDto, user: any) {

    const authorUser = await this.usersService.findOneById(user.userId);

    const assigneeUser = await this.usersService.findOneById(

      createTaskDto.assignee.id,

    );

 

    const newTask = new Task();

    newTask.title = createTaskDto.title;

    newTask.status = createTaskDto.status;

    newTask.author = authorUser;

    newTask.assignee = assigneeUser;

 

    await this.taskRepository.save(newTask);

 

    return newTask.getDto();

  }

 

  async findAll(user: any) {

    return await this.taskRepository.find({

      where: { author: { id: user.userId } },

    });

  }

 

  async findOne(id: number) {

    return this.taskRepository.findOneBy({ id });

  }

 

  async update(id: number, updateTaskDto: CreateUpdateTaskDto) {

    const existedTask = await this.findOne(id);

    const assigneeUser = await this.usersService.findOneById(

      updateTaskDto.assignee.id,

    );

    if (existedTask) {

      existedTask.title = updateTaskDto.title;

      existedTask.status = updateTaskDto.status;

      existedTask.assignee = assigneeUser;

 

      await this.taskRepository.save(existedTask);

 

      return existedTask.getDto();

    }

  }

 

  async remove(id: number) {

    await this.taskRepository

      .createQueryBuilder()

      .softDelete()

      .where('id = :id', { id })

      .execute();

  }

}