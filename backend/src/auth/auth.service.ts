import { Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {

  LoginResponseDto,

  SecuredUser,

  SignUpRequestDto,

} from 'src/common/types';

import { UsersService } from 'src/users/users.service';

 

export type NewUser = {

  username: string;

  password: string;

};

 

@Injectable()

export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(

    private usersService: UsersService,

    private jwtService: JwtService,

  ) {}

 

  async validateUser(

    username: string,

    pass: string,

  ): Promise<SecuredUser | null> {

    const user = await this.usersService.findOne(username);

    if (user) {

      const passwordIsCorrect = await bcrypt.compare(pass, user.passwordHash);

      if (passwordIsCorrect) {

        const { passwordHash, ...result } = user;

        return result;

      }

    }

 

    return null;

  }

 

  async login(user: SecuredUser): Promise<LoginResponseDto> {

    const payload = { username: user.name, sub: user.id, roles: user.roles };

    return {

      access_token: this.jwtService.sign(payload),

      username: user.name,

      firstname: user.firstname,

      lastname: user.lastname,

      roles: user.roles,

    };

  }

 

  async signup(payload: SignUpRequestDto) {

    const user = await this.usersService.findOne(payload.username);

    if (user) {

      return { success: false };

    }

    const createdUser = await this.usersService.create(

      payload.username,

      payload.password,

      payload.firstname,

      payload.lastname,

    );

 

    if (createdUser) {

      return { success: true };

    }

    return { success: false };

  }

}