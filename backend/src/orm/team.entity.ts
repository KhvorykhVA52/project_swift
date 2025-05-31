import { 
  Entity, 
  PrimaryGeneratedColumn, 
  OneToOne, 
  ManyToOne, 
  OneToMany, 
  Column,
  JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Idea } from './idea.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => User, (user) => user.ledTeam, { nullable: true })
  @JoinColumn()
  leader: User | null;

  @ManyToOne(() => User, (user) => user.ownedTeams)
  owner: User;

  @OneToMany(() => User, (user) => user.team)
  members: User[];

  @OneToMany(() => Project, (project) => project.team)
  projects: Project[];

  @OneToOne(() => Idea, (idea) => idea.team, { nullable: true })
  idea: Idea;
}