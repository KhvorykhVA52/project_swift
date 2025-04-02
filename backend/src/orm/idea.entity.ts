import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';   
  import { User } from './user.entity';
  import { Competence, StatusIdea } from 'src/common/types'; 
  import { Comments } from './comment.entity';
  
  @Entity()
  export class Idea {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    problem: string;
  
    @Column()
    solution: string;
  
    @Column()
    result: string;
  
    @Column()
    resource: string;
  
    @Column({ type: 'varchar', array: true, default: [] })
    stack: Competence[];
    
    @Column({ default: StatusIdea.new })
    status: StatusIdea;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; 
  
    // Комментарии
    @OneToMany(() => Comments, (comment) => comment.idea)
    comments: Comments[];
  
    // Заказчик идеи
    @ManyToOne(() => User, (user) => user.customerIdeas, { eager: true, onDelete: 'CASCADE' })
    customer: User;
    
    // Инициатор идеи
    @ManyToOne(() => User, (user) => user.initiatedIdeas, { eager: true, onDelete: 'CASCADE' })
    initiator: User;
  }