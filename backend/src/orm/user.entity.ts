import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Team } from './team.entity';
import { Role, UserAccountStatus, SecuredUser, Competence } from 'src/common/types';
import { Idea } from './idea.entity';
import { Portfolio } from './portfolio.entity';
import { Comments } from './comment.entity';
import { Project } from './project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @Column({ type: 'varchar', default: [Role.user], array: true })
  roles: Role[];

  @Column({ default: UserAccountStatus.pending })
  status: UserAccountStatus;

  @Column({ type: 'varchar', array: true, default: '{}' })
  competence: Competence[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => Team, (team) => team.user_leader)
  team_leader: Team;

  @OneToMany(() => Team, (team) => team.user_owner)
  team_owner: Team[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolio: Portfolio[];

  @OneToMany(() => Idea, (idea) => idea.initiator)
  idea_initiator: Idea[];

  @OneToMany(() => Idea, (idea) => idea.customer)
  idea_customer: Idea[];

  @OneToMany(() => Project, (project) => project.initiator)
  project_initiator: Project[];

  @OneToMany(() => Project, (project) => project.customer)
  project_customer: Project[];

  @OneToMany(() => Comments, (comment) => comment.users)
  comment: Comments[];

  @ManyToOne(() => Team, (team) => team.user, { eager: true, onDelete: 'SET NULL' })
  team: Team;

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
