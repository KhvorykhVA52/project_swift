import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity'; // Проверьте путь!
import { Team } from './team.entity';
import { StatusProject, SecuredProject } from '../common//types';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ 
    type: 'enum',
    enum: StatusProject,
    default: StatusProject.searchTeam,
  })
  status: StatusProject;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  deadline: Date;

  @ManyToOne(() => User, (user) => user.ownedProjects)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Team, (team) => team.projects, { nullable: true })
  team: Team;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  getSecuredDto(): SecuredProject {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
    };
  }
}