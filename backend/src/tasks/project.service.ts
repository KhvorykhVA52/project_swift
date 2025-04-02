import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../orm/project.entity';
import { StatusProject } from '../common//types';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = this.projectRepository.create(projectData);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ 
      relations: ['owner', 'team', 'tasks'] 
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ 
      where: { id },
      relations: ['owner', 'team', 'tasks'],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: number, updateData: Partial<Project>): Promise<Project> {
    await this.projectRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async updateStatus(id: number, status: StatusProject): Promise<Project> {
    await this.projectRepository.update(id, { status });
    return this.findOne(id);
  }
}