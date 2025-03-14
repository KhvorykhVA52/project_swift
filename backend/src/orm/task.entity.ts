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

import { TaskDto, TaskStatus } from 'src/common/types';

 

@Entity()

export class Task {

  @PrimaryGeneratedColumn()

  id: number;

 

  @Column({ default: '' })

  title: string;

 

  @Column({ default: TaskStatus.new })

  status: TaskStatus;

 

  @ManyToOne(() => User, { eager: true }) // ++

  assignee: User; // ++

 

  @ManyToOne(() => User, { eager: true })

  author: User;

 

  @CreateDateColumn({ name: 'created_at' })

  createdAt!: Date;

 

  @UpdateDateColumn({ name: 'updated_at' })

  UpdatedAt!: Date;

 

  @DeleteDateColumn()

  deletedAt?: Date;

 

  @VersionColumn()

  version!: number;

 

  getDto(): TaskDto {

    return {

      id: this.id,

      title: this.title,

      status: this.status,

      assignee: this.author.getSecuredDto(), // +++

      author: this.author.getSecuredDto(),

      createdAt: this.createdAt,

    };

  }

}