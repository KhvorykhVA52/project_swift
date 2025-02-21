import { DataSource } from 'typeorm';

import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';

import { User } from './user.entity';

 

config();

 

const configService = new ConfigService();

 

export default new DataSource({

  type: 'postgres',

  host: configService.get('DB_HOST'),

  port: configService.get('DB_PORT'),

  username: configService.get('DB_USER'),

  password: configService.get('DB_PASSWORD'),

  database: configService.get('DB_DATABASE'),

  entities: [User],

  migrations: ['dist/src/orm/migrations/*.js'],

});