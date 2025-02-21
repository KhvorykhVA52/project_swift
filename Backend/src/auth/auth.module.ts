import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';

import { UsersModule } from 'src/users/users.module';

import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from './local.strategy';

import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from './jwt.strategy';

 

@Module({

  imports: [

    UsersModule,

    PassportModule,

    JwtModule.registerAsync({

      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => ({

        secret: configService.get('JWT_SECRET'),

        signOptions: { expiresIn: '30m' },

      }),

      inject: [ConfigService],

    }),

  ],

  providers: [AuthService, LocalStrategy, JwtStrategy],

  controllers: [AuthController],

})

export class AuthModule {}

