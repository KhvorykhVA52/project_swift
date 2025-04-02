import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './user.entity';
import { Task } from './task.entity';
import { Team } from './team.entity';
import { Project } from './project.entity';
import { Portfolio } from './portfolio.entity';
import { Idea } from './idea.entity';
import { Comments } from './comment.entity';
import * as path from 'path'; // Добавляем path для корректных путей

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    User,
    Task,
    Team,
    Project,
    Portfolio,
    Idea,
    Comments
  ],
  migrations: [path.join(__dirname, 'migrations/*.{js,ts}')], // Улучшенный путь
  synchronize: false, // Всегда false для production!
  logging: true, // Полезно для разработки
  migrationsRun: false, // Лучше запускать вручную
  migrationsTableName: 'migrations', // Явное указание имени таблицы
  extra: {
    ssl: configService.get('DB_SSL') === 'true' ? { 
      rejectUnauthorized: false 
    } : false
  }
});