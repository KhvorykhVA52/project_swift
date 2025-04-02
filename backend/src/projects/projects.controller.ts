import { Controller, Get, Post, UseGuards, Body} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from 'src/common/types';

@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService) {}

    @Get()
    //@UseGuards(JwtAuthGuard)

    async findAll() {

      return this.projectsService.findAll();
  
    }

    @Post()
    //@UseGuards(JwtAuthGuard)
    async create(@Body() body: CreateProjectDto) {

      const createdProject = await this.projectsService.create(body)

      return createdProject;

    }

}
