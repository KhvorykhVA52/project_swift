import { Controller, Get, Post, UseGuards, Body} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService) {}

    @Get()
    //@UseGuards(JwtAuthGuard)
    async findAll() {
      return this.projectsService.findAll();
    }

    @Post('create')
    //@UseGuards(JwtAuthGuard)
    async create(@Body() body) {
      return this.projectsService.create(body.ideaId);
    }

    @Post('undocreate')
    async undo_create(@Body() body) {
      return this.projectsService.undo_create(body.projectId);
    }

}
