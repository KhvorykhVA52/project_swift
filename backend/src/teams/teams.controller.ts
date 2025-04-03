import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from '../orm/team.entity';
import { User } from '../orm/user.entity';
import { CreateTeamDto } from '../common/dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post(':id')
  async create(@Param('id') id: number, @Body() newData: CreateTeamDto): Promise<Team | string> {
    return 'id: '+id;
    //return this.teamsService.create(id, newData);
  }

  @Get()
  async findAll(): Promise<Team[] | string> {
    return this.teamsService.findAll();
  }

  @Get('GetByOwner/:id')
  async GetByOwner(@Param('id') id) {
    return this.teamsService.GetByOwner(id);
  }

  @Post('AddInByOne')
  async AddInByOne(@Body() body) {
    return this.teamsService.AddInByOne(body.value);
  }
}