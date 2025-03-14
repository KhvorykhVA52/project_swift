import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Другие поля...

  @ManyToOne(() => User, (user) => user.project_initiator)
  initiator: User;

  @ManyToOne(() => User, (user) => user.project_customer)
  customer: User;

  @ManyToOne(() => Team, (team) => team.projects)
  team: Team;

  // Другие поля и методы
}
