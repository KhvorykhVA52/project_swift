import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from '../orm/team.entity';
import { User } from '../orm/user.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Post('GetByOwner')
  async GetByOwner(@Body() body) {
    return this.teamsService.GetByOwner(body.value);
  }

  @Post('AddInByOne')
  async AddInByOne(@Body() body) {
    return this.teamsService.AddInByOne(body.value);
  }
}