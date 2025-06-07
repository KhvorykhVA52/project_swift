import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity'; // Проверьте путь!
import { Team } from './team.entity';
//import { StatusProject, SecuredProject } from '../common//types';
import { SecuredProject } from '../common//types';
import { Idea } from './idea.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  //@Column({ 
  //  type: 'enum',
  //  enum: StatusProject,
  //  default: StatusProject.searchTeam,
  //})
  //status: StatusProject;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  deadline: Date;

  @ManyToOne(() => User, (user) => user.ownedProjects, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User | null;

  @ManyToOne(() => Team, (team) => team.projects, { nullable: true })
  team: Team | null;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  getSecuredDto(): SecuredProject {
    return {
      id: this.id,
      title: this.title,
    };
  }

  @OneToOne(() => Idea, (idea) => idea.project, { nullable: true})
  @JoinColumn()
  idea: Idea | null;
}