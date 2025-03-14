import {

    Body,
  
    Controller,
  
    Get,
  
    Logger,
  
    Param,
  
    Patch,
  
    Post,
  
    UseGuards,
  
  } from '@nestjs/common';
  
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
  import { UsersService } from './users.service';
  
  import { Roles } from 'src/auth/roles.decorator';
  
  import { CreateUserDto, Role, UpdateUserDto } from 'src/common/types';
  
  import { RolesGuard } from 'src/auth/roles.guard';
  
   
  
  @Controller('users')
  
  export class UsersController {
  
    private readonly logger = new Logger(UsersController.name);
  
   
  
    constructor(private usersService: UsersService) {}
  
   
  
    @Get()
  
    @UseGuards(JwtAuthGuard)
  
    async findAll() {
  
      return this.usersService.findAll();
  
    }
  
   
  
    @Post(':id/status')
  
    @Roles(Role.admin)
  
    @UseGuards(JwtAuthGuard, RolesGuard)
  
    async setUserStatus(@Param('id') id, @Body() body) {
  
      return this.usersService.setStatus(id, body.value);
  
    }
  
   
  
    @Post()
  
    @Roles(Role.admin)
  
    @UseGuards(JwtAuthGuard, RolesGuard)
  
    async create(@Body() body: CreateUserDto) {
  
      const createdUser = await this.usersService.create(
  
        body.email,
  
        body.password,
  
        body.firstname,
  
        body.lastname,
  
        body.roles,
  
        body.status,
  
      );
  
      return createdUser.getSecuredDto();
  
    }
  
   
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUser(@Param('id') id: number) {
    const user = await this.usersService.findOneById(id);
    if (user) return user.getSecuredDto();
  }
  
   
  
    @Patch(':id')
  
    @UseGuards(JwtAuthGuard)
  
    update(@Param('id') id: number, @Body() payload: UpdateUserDto) {
  
      return this.usersService.update(id, payload);
  
    }
  
  }