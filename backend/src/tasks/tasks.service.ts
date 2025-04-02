import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateTaskDto, TaskDto } from 'src/common/types';
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

  private toDto(task: Task): TaskDto {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      createdAt: task.createdAt,
      author: {
        id: task.author.id,
        email: task.author.email,
        firstname: task.author.firstname,
        lastname: task.author.lastname,
        roles: task.author.roles,
        status: task.author.status,
      },
      assignee: task.assignee ? {
        id: task.assignee.id,
        email: task.assignee.email,
        firstname: task.assignee.firstname,
        lastname: task.assignee.lastname,
        roles: task.assignee.roles,
        status: task.assignee.status,
      } : undefined,
    };
  }

  async create(createTaskDto: CreateUpdateTaskDto, user: any) {
    const authorUser = await this.usersService.findOneById(user.userId);
    const assigneeUser = createTaskDto.assignee?.id 
      ? await this.usersService.findOneById(createTaskDto.assignee.id)
      : null;

    const newTask = new Task();
    newTask.title = createTaskDto.title;
    newTask.status = createTaskDto.status;
    newTask.author = authorUser;
    newTask.assignee = assigneeUser;

    await this.taskRepository.save(newTask);

    return this.toDto(newTask);
  }

  async findAll(user: any) {
    const tasks = await this.taskRepository.find({
      where: { author: { id: user.userId } },
      relations: ['author', 'assignee'],
    });
    return tasks.map(task => this.toDto(task));
  }

  async findOne(id: number) {
    return this.taskRepository.findOne({ 
      where: { id },
      relations: ['author', 'assignee'],
    });
  }

  async update(id: number, updateTaskDto: CreateUpdateTaskDto) {
    const existedTask = await this.findOne(id);
    if (!existedTask) {
      throw new Error('Task not found');
    }

    const assigneeUser = updateTaskDto.assignee?.id
      ? await this.usersService.findOneById(updateTaskDto.assignee.id)
      : null;

    existedTask.title = updateTaskDto.title;
    existedTask.status = updateTaskDto.status;
    existedTask.assignee = assigneeUser;

    await this.taskRepository.save(existedTask);

    return this.toDto(existedTask);
  }

  async remove(id: number) {
    await this.taskRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();
  }
}