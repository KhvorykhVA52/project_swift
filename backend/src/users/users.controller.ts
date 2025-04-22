import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreateUserDto, Role, UpdateUserDto, ExtendedUser } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req): Promise<ExtendedUser | null> {
    return this.usersService.getFullUserInfo(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(@Request() req, @Body() payload: UpdateUserDto): Promise<ExtendedUser | null> {
    return this.usersService.update(req.user.userId, payload);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.updateAvatar(req.user.userId, avatarUrl);
    return { avatarUrl };
  }

  @Delete('me/avatar')
  @UseGuards(JwtAuthGuard)
  async removeAvatar(@Request() req) {
    await this.usersService.updateAvatar(req.user.userId, '');
    return { success: true };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<ExtendedUser[]> {
    return this.usersService.findAll();
  }

  @Post(':id/status')
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async setUserStatus(@Param('id') id: number, @Body() body: { value: string }) {
    return this.usersService.setStatus(id, body.value as any);
  }

  @Post()
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() body: CreateUserDto): Promise<ExtendedUser> {
    return this.usersService.createUser(body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number): Promise<ExtendedUser | null> {
    return this.usersService.getFullUserInfo(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() payload: UpdateUserDto): Promise<ExtendedUser | null> {
    return this.usersService.update(id, payload);
  }
}