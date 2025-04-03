import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from '../orm/team.entity';
import { User } from '../orm/user.entity';
import { CreateTeamDto } from '../common/dto/create-team.dto';
import { AddToTeamDto } from '../common/dto/add-to-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create/:id')
  async create(@Param('id') id: number, @Body() newData: CreateTeamDto): Promise<Team | string> {
    return this.teamsService.create(id, newData);
  }

  @Get()
  async findAll(): Promise<Team[] | string> {
    return this.teamsService.findAll();
  }

  @Post('addinbyone')
  async AddInByOne(@Body() body: AddToTeamDto) {
    return this.teamsService.AddInByOne(body);
  }
}