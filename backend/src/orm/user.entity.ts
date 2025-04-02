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
import { Team } from './team.entity';
import { Role, UserAccountStatus, SecuredUser, Competence } from 'src/common/types';
import { Idea } from './idea.entity';
import { Portfolio } from './portfolio.entity';
import { Comments } from './comment.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: '' })
  firstname: string;

  @Column({ default: '' })
  lastname: string;

  @Column({ default: '' })
  group: string;

  @Column({ default: '' })
  telephone: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.user] })
  roles: Role[];

  @Column({ type: 'enum', enum: UserAccountStatus, default: UserAccountStatus.pending })
  status: UserAccountStatus;

  @Column({ type: 'varchar', array: true, default: [] })
  competence: Competence[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Связи с командами
  @OneToOne(() => Team, (team) => team.leader)
  @JoinColumn()
  ledTeam: Team;

  @OneToMany(() => Team, (team) => team.owner)
  ownedTeams: Team[];

  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'SET NULL' })
  team: Team;

  // Связи с проектами
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  // Связи с задачами
  @OneToMany(() => Task, (task) => task.author)
  createdTasks: Task[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  // Портфолио
  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios: Portfolio[];

  // Связи с идеями
  @OneToMany(() => Idea, (idea) => idea.initiator)
  initiatedIdeas: Idea[];

  @OneToMany(() => Idea, (idea) => idea.customer)
  customerIdeas: Idea[];

  // Комментарии
  @OneToMany(() => Comments, (comment) => comment.author)
  comments: Comments[];

  // Метод для безопасного возврата данных
  getSecuredDto(): SecuredUser {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      roles: this.roles,
      status: this.status,
    };
  }
}