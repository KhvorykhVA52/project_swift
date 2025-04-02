import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/orm/project.entity';
import { CreateProjectDto } from 'src/common/types';

@Injectable()
export class ProjectsService {

  constructor(

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

  ) {}

  async create(project: CreateProjectDto): Promise<Project> {
     
    const newproject = new Project();

    newproject.title = project.title;
    newproject.description = project.description;

    const createdProject = await this.projectRepository.save(newproject);

    return createdProject;

  }

  async findAll() {

    return (await this.projectRepository.find()).map((u) => u.getSecuredDto());

  }

}
