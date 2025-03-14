
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

    @Column({ type: 'varchar', array: true, default: '{}' })
    stack: Competence[];
    
    @Column({ default: StatusIdea.new })
    status: StatusIdea;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; 

    @OneToMany(() => Comments, (comments) => comments.idea)
    comment: Comments[];

    @ManyToOne(() => User, (user) => user.idea_customer, { eager: true, onDelete: 'CASCADE' })
    customer: User;
    
    @ManyToOne(() => User, (user) => user.idea_initiator, { eager: true, onDelete: 'CASCADE' })
    initiator: User;
}