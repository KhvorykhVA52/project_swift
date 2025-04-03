import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../orm/team.entity';
import { CreateTeamDto } from '../common/dto/create-team.dto';
import { User } from '../orm/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()

export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(id: number, newData: CreateTeamDto): Promise<Team|string> {
    class createTeam {
      owner: User;
      name: string;
      description: string;
    }

    let newTeamData = new createTeam;
    const gotUser = await this.userRepository.findOneById(id);

    if (gotUser == null) {
      return 'Error: create() - did not found by id';
    }

    newTeamData.owner = gotUser;
    newTeamData.name = newData.name;
    newTeamData.description = newData.description;

    const team = this.teamsRepository.create(newTeamData);
    return await this.teamsRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return await this.teamsRepository.find();
  }

  async GetByOwner(id: number): Promise<Team | any> {
    const gotUser = await this.userRepository.findOneById(id);

    if (gotUser == null) {
      return 'Error: GetByOwner() - did not found by id';
    }
    return this.teamsRepository.findOneBy({owner: gotUser});
  }

  async AddInByOne(ownerId: number, newMemberId: number): Promise<string> {

    let gotOwner = await this.userRepository.findOneById(ownerId);

    if (gotOwner == null) {
      return 'Error: AddInByOne() - did not found by ownerId';
    }

    const team = await this.teamsRepository.findOneBy({owner: gotOwner});
    
    if (team) {
      let gotUser = await this.userRepository.findOneById(newMemberId);

      if (gotUser == null) {
        return 'Error: AddInByOne() - did not found by newMemberId';
      }

      gotUser.team = team;

      const ans = await this.userRepository.save(gotUser);
      if (ans) {
        return 'OK';
      }
    }

    return 'Error: team not found';
  }
}