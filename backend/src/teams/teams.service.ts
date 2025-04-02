import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../orm/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from '../orm/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamsRepository.create(createTeamDto);
    return await this.teamsRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return await this.teamsRepository.find();
  }

  async GetByOwner(user: User): Promise<Team | any> {
    return this.teamsRepository.findOneBy({owner: user});
  }

  async AddInByOne(user: User[]): Promise<string> {
    let userId = user[1].id;

    const isMember = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoin('team.members', 'member')
      .where('member.id = :userId', { userId })
      .getOne();

    if (isMember) {
      return 'Error: Already in some team';
    }

    const team = await this.teamsRepository.findOneBy({owner: user[0]});
    
    if (team) {
      team.members.push(user[1]);

      const ans = await this.teamsRepository.save(team);
      if (ans) {
        return 'OK';
      }
    }

    return 'Error: team not found';
  }
}