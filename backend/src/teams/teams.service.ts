import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../orm/team.entity';
import { CreateTeamDto } from '../common/dto/create-team.dto';
import { User } from '../orm/user.entity';
import { UsersService } from '../users/users.service';
import { AddToTeamDto } from '../common/dto/add-to-team.dto';

@Injectable()

export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(id: number, newData: CreateTeamDto): Promise<Team|string> {
    class createTeam {
      owner: User;
      name: string;
      description: string;
    }

    const newTeamData = new Team();
    const gotUser = await this.userRepository.findOne({ where: { id: id } })

    if (gotUser == null) {
      return 'Error: create() - did not found by id';
    }

    newTeamData.owner = gotUser;
    newTeamData.name = newData.name;
    newTeamData.description = newData.description;

    return await this.teamRepository.save(newTeamData);
  }

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  async AddInByOne(data: AddToTeamDto): Promise<void> {
    //const teamRepository = getRepository(Team);
  //const userRepository = getRepository(User);

  const team = await this.teamRepository.findOne({
        where: { id: data.teamId },
        relations: ['members'],
      }); // Загружаем команду и ее участников
  const user = await this.userRepository.findOne({ where: { id: data.userId} });

  if (!team) {
    throw new Error('Команда с указанным ID не найдена.');
  }

  if (!user) {
    throw new Error('Пользователь с указанным ID не найден.');
  }

  // Устанавливаем связь пользователя с командой (важно для правильной работы @ManyToOne)
  user.team = team;
  await this.userRepository.save(user);  // Сохраняем изменения в сущности User

  // Обновляем массив участников команды (необязательно, но может быть полезно)
  if (!team.members) {
    team.members = [];
  }
  team.members.push(user);
  await this.teamRepository.save(team);

  console.log(`Пользователь ${user.firstname} добавлен в команду ${team.name}`);
  }
}