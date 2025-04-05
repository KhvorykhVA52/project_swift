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
import { TeamInvite } from './team-invite.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => User, (user) => user.ledTeam)
  @JoinColumn()
  leader: User;

  @ManyToOne(() => User, (user) => user.ownedTeams)
  owner: User;

  @OneToMany(() => User, (user) => user.team)
  members: User[];

  @OneToMany(() => Project, (project) => project.team)
  projects: Project[];

  @OneToMany(() => TeamInvite, (invite) => invite.team) // Убрали eager: true
  invites: TeamInvite[];
}