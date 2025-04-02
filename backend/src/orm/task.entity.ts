import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { TaskStatus } from '../common/types';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ 
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.new 
  })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.createdTasks, { eager: true })
  author: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, { 
    eager: true, 
    nullable: true 
  })
  assignee: User | null;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE' // Добавлено каскадное удаление
  })
  project: Project;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @VersionColumn()
  version: number;
}