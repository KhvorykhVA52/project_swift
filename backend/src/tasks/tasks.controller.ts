import {

    Controller,
  
    Get,
  
    Post,
  
    Body,
  
    Patch,
  
    Param,
  
    Delete,
  
    UseGuards,
  
    Req,
  
  } from '@nestjs/common';
  
  import { TasksService } from './tasks.service';
  
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
  import { CreateUpdateTaskDto } from 'src/common/types';
  
   
  
  @Controller('tasks')
  
  export class TasksController {
  
    constructor(private readonly tasksService: TasksService) {}
  
   
  
    @Post()
  
    @UseGuards(JwtAuthGuard)
  
    create(@Body() createTaskDto: CreateUpdateTaskDto, @Req() request) {
  
      return this.tasksService.create(createTaskDto, request.user);
  
    }
  
   
  
    @Get()
  
    @UseGuards(JwtAuthGuard)
  
    findAll(@Req() request) {
  
      return this.tasksService.findAll(request.user);
  
    }
  
   
  
    @Get(':id')
  
    @UseGuards(JwtAuthGuard)
  
    findOne(@Param('id') id: string) {
  
      return this.tasksService.findOne(+id);
  
    }
  
   
  
    @Patch(':id')
  
    @UseGuards(JwtAuthGuard)
  
    update(@Param('id') id: string, @Body() updateTaskDto: CreateUpdateTaskDto) {
  
      return this.tasksService.update(+id, updateTaskDto);
  
    }
  
   
  
    @Delete(':id')
  
    @UseGuards(JwtAuthGuard)
  
    remove(@Param('id') id: string) {
  
      return this.tasksService.remove(+id);
  
    }
  
  }
  