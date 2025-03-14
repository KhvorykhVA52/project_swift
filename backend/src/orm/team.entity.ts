import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.team_leader)
  user_leader: User;

  @ManyToOne(() => User, (user) => user.team_owner)
  user_owner: User;

  @ManyToOne(() => User, (user) => user.team)
  user: User;

  @OneToMany(() => Project, (project) => project.team)
  projects: Project[];

  // Другие поля и методы
}
