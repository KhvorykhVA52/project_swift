import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  LoginResponseDto,
  SecuredUser,
  SignUpRequestDto,
} from '../common/types';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<SecuredUser | null> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      return null;
    }

    const passwordIsCorrect = await bcrypt.compare(pass, user.passwordHash);
    if (!passwordIsCorrect) {
      this.logger.warn(`Invalid password for user: ${username}`);
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: SecuredUser): Promise<LoginResponseDto> {
    const payload = { 
      username: user.email, 
      sub: user.id, 
      roles: user.roles 
    };
    
    this.logger.log(`User logged in: ${user.email}`);
    return {
      access_token: this.jwtService.sign(payload),
      username: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      roles: user.roles,
      userId: user.id,
    };
  }

  async signup(payload: SignUpRequestDto) {
    const existingUser = await this.usersService.findOne(payload.username);
    if (existingUser) {
      this.logger.warn(`User already exists: ${payload.username}`);
      return { success: false, message: 'User already exists' };
    }

    const createdUser = await this.usersService.create(
      payload.username,
      payload.password,
      payload.firstname,
      payload.lastname,
    );

    if (createdUser) {
      this.logger.log(`User created: ${payload.username}`);
      return { success: true, message: 'User created successfully' };
    }

    this.logger.error(`Failed to create user: ${payload.username}`);
    return { success: false, message: 'Failed to create user' };
  }
}