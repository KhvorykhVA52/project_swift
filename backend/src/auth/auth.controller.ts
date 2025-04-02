import {
  Controller,
  Request,
  Post,
  UseGuards,
  Logger,
  HttpCode,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpRequestDto } from '../common/types';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req) {
    this.logger.log(`Login attempt for user: ${req.user?.email}`);
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() payload: SignUpRequestDto) {
    this.logger.log(`Signup attempt for username: ${payload.username}`);
    return this.authService.signup(payload);
  }
}