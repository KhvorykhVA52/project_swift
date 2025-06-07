import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/orm/project.entity';
//import { CreateProjectDto } from 'src/common/types';
import { Idea } from 'src/orm/idea.entity';
import { User } from 'src/orm/user.entity';
import { Team } from 'src/orm/team.entity';

@Injectable()
export class ProjectsService {

  constructor(

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(id: number) {
    const idea = await this.ideaRepository.findOne({
      where: {id: id},
      relations: ['initiator', 'team', 'project'],
    });
    
    if (!idea) {
      console.log(`ERROR: projects.service.create(): не найден Idea при Idea.id=${id}`);
      return null;
    }

    if (!idea.team || !idea.team.id) {
      console.log(`!!!CRITICAL ERROR!!!: projects.service.create(): отсутствует Team при Idea.id=${id}`);
      return null;
    }

    const team = await this.teamRepository.findOne({
      where: {id: idea.team.id}
    })

    if (!team) {
      console.log(`!!!CRITICAL ERROR!!!: projects.service.create(): не найден Team (Idea.team) при ideaId=${id}`);
      return null;
    }

    if (idea.project !== null ) {
      console.log(`ERROR: projects.service.create(): уже существует Project при Idea.id=${id}`);
      return null;
    }

    const user = await this.userRepository.findOne({
      where: {id: idea.initiator.id},
    });

    if (!user) {
      console.log(`!!!CRITICAL ERROR!!!: projects.service.create(): не найден User (Idea.initiator) при ideaId=${id}`);
      return null;
    }

    const newProject = new Project();

    newProject.idea = idea;
    newProject.title = idea.name;
    newProject.owner = user;
    newProject.team = team;
    
    !team.projects ? team.projects = [ newProject ] : team.projects.push(newProject);

    !user.ownedProjects? user.ownedProjects = [ newProject ] : user.ownedProjects.push(newProject);

    idea.project = newProject;

    const createdProject = await this.projectRepository.save(newProject);
    await this.userRepository.save(user);
    await this.teamRepository.save(team);
    await this.ideaRepository.save(idea);

    console.log(`OK: projects.service.create(ideaId=${id})`);

    return true;

  }

  async findAll() {

    return (await this.projectRepository.find()).map((u) => u.getSecuredDto());

  }

  async undo_create(id: number) {
    const project = await this.projectRepository.findOne({
      where: {id: id},
      relations: ['idea', 'team', 'owner'],
    });

    if (!project) {
      console.log(`Error: projects.service.undo_create(): не найден Project при projectId=${id}`);
      return true;
    }

    if (!project.idea) {
      console.log(`!!!CRITICAL ERROR!!!: projects.service.undo_create(): отсутствует Idea при projectId=${id}`);
    } else {
      project.idea = null;
    }

    if (!project.team) {
      console.log(`!!!CRITICAL ERROR!!!: projects.service.undo_create(): отсутствует Team при projectId=${id}`);
      return null;
    }

    if (!project.owner) {
      console.log(`!!!CRITICAL ERROR!!!: projects.service.undo_create(): отсутствует owner при projectId=${id}`);
      return null;
    }

    project.team = null;
    project.owner = null;
    
    await this.projectRepository.delete(id);

    console.log(`OK: projects.service.undo_create(projectId=${id})`);
    return true;
  }

}