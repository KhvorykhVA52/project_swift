import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './user.entity';
import { Task } from './task.entity';
import { Team } from './team.entity';
import { Project } from './project.entity';
import { Portfolio } from './portfolio.entity'; // Добавьте импорт Portfolio
import { Idea } from './idea.entity'; // Добавьте импорт Idea
import { Comments } from './comment.entity'; // Добавьте импорт Comments

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User, Task, Team, Project, Portfolio, Idea, Comments], // Добавьте все сущности сюда
  migrations: ['dist/orm/migrations/*.js'],
});
