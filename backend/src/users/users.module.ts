import { Module } from '@nestjs/common';

import { UsersService } from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/orm/user.entity';

import { UsersController } from './users.controller';

import { RolesGuard } from 'src/auth/roles.guard';

 

@Module({

  imports: [TypeOrmModule.forFeature([User])],

  providers: [UsersService, RolesGuard],

  exports: [UsersService],

  controllers: [UsersController],

})

export class UsersModule {}