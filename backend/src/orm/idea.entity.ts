import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    JoinColumn,
  } from 'typeorm';   
  import { User } from './user.entity';
  import { Competence, StatusIdea } from '../common/types'; 
  import { Comments } from './comment.entity';
  import { Team } from './team.entity';
import { Project } from './project.entity';
  
  
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
    @ManyToOne(() => User, (user) => user.customerIdeas, { eager: true, onDelete: 'CASCADE', nullable: true })
    customer: User | null;
    
    // Инициатор идеи
    @ManyToOne(() => User, (user) => user.initiatedIdeas, { eager: true, onDelete: 'CASCADE' })
    initiator: User;

    @OneToOne(() => Team, (team) => team.idea, { eager: true, onDelete: 'CASCADE', nullable: true })
    @JoinColumn()
    team: Team;

    @OneToOne(() => Project, (project) => project.idea, { nullable: true })
    @JoinColumn()
    project: Project | null;
  }