import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Idea } from './idea.entity';
  
  @Entity()
  export class Comments {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @Column()
    comment: string;
    
    @Column()
    grade: string;
  
    // Автор комментария
    @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: 'CASCADE' })
    author: User;
  
    // Связанная идея
    @ManyToOne(() => Idea, (idea) => idea.comments, { eager: true, onDelete: 'CASCADE' })
    idea: Idea;
  }