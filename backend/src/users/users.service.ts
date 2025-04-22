import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/orm/user.entity';
import * as bcrypt from 'bcrypt';
import { Role, UpdateUserDto, UserAccountStatus, CreateUserDto } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'firstname', 'lastname', 'passwordHash', 'roles', 'status']
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'firstname', 'lastname', 'roles', 'status', 'group', 'telephone']
    });
  }

  async create(email: string, password: string, firstname: string, lastname: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      passwordHash,
      firstname,
      lastname,
      roles: [Role.user],
      status: UserAccountStatus.pending,
      group: '',
      telephone: '',
      avatarUrl: ''
    });
    return await this.userRepository.save(newUser);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      email: createUserDto.email,
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      passwordHash: await bcrypt.hash(createUserDto.password, 5),
      roles: createUserDto.roles || [Role.user],
      status: createUserDto.status || UserAccountStatus.pending,
      group: createUserDto.group || '',
      telephone: createUserDto.telephone || ''
    });

    return await this.userRepository.save(user);
  }

  async setStatus(id: number, status: UserAccountStatus): Promise<void> {
    await this.userRepository.update(id, { status });
  }

<<<<<<< HEAD
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstname', 'lastname', 'roles', 'status', 'group', 'telephone']
    });
=======
  async findAll() {
    return (await this.userRepository.find({
      relations: ["team"],
    }));
  }

  async securedFindAll() {
    //не используется
    return (await this.userRepository.find()).map((u) => u.getSecuredDto());
>>>>>>> d8b70632f222d2e533d8659b662f94902383d6bf
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<void> {
    await this.userRepository.update(id, { avatarUrl });
  }

  async getFullUserInfo(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['team', 'ledTeam']
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.getFullUserInfo(id);
  }
}