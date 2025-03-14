import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  // Другие поля...

  @ManyToOne(() => User, (user) => user.portfolio)
  user: User;

  // Другие поля и методы
}
