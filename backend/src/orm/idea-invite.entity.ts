import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
import { Idea } from './idea.entity';
import { Team } from './team.entity';

@Entity()
export class IdeaInvite {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Idea, { onDelete: 'CASCADE', eager: true })
    idea: Idea;

    @ManyToOne(() => Team, { onDelete: 'CASCADE', eager: true })
    team: Team;

    @Column()
    isInitiatorInviter: boolean;

    @Column()
    status: string;
}