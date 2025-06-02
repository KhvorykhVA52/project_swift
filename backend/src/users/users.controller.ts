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
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreateUserDto, Role, UpdateUserDto, ExtendedUser } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import { Response } from 'express';

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
    await this.usersService.update(req.user.userId, payload);
    return this.usersService.getFullUserInfo(req.user.userId); // Важно возвращать полные данные
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'avatars'),
      filename: (req, file, cb) => {
        const randomName = uuidv4();
        const ext = extname(file.originalname).toLowerCase();
        return cb(null, `${randomName}${ext}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
      const ext = extname(file.originalname).toLowerCase();
      if (!validExtensions.includes(ext)) {
        return cb(new Error('Invalid file type'), false);
      }
      cb(null, true);
    }
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    this.logger.log(`Uploading avatar for user ${req.user.userId}`);
    if (!file) {
      throw new Error('File upload failed');
    }
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.updateAvatar(req.user.userId, avatarUrl);
    return { avatarUrl };
  }

  @Delete('me/avatar')
  @UseGuards(JwtAuthGuard)
  async removeAvatar(@Request() req) {
    this.logger.log(`Removing avatar for user ${req.user.userId}`);
    await this.usersService.updateAvatar(req.user.userId, '');
    return { success: true };
  }

  @Get('me/getavatar/:name')
  async getAvatar(@Param('name') name, @Res() res: Response) {
    const filepath = join(process.cwd(), 'uploads', 'avatars', name);

    if (!existsSync(filepath)) {
      console.log(`ERROR: users.service.getAvatar: не найден файл при name=${name}`);
      return res.status(404).json(null);
    }

    return res.sendFile(filepath);
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