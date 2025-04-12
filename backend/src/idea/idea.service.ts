import { Injectable } from '@nestjs/common';
import { Idea } from 'src/orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { User } from 'src/orm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}
    
    async createIdea(input: CreateIdeaDto ) {
        const user = await this.userRepository.findOneBy({id: input.initiatorId});

        if (!user) {
            console.log(`ERROR: idea.service.createIdea(): не найден User при User.id=${input.initiatorId}`);
            return `ERROR`;
        }

        const newIdea = new Idea();
        newIdea.name = input.name;
        newIdea.problem = input.problem;
        newIdea.solution = input.solution;
        newIdea.result = input.result;
        newIdea.resource = input.resource;
        newIdea.initiator = user;
        
        this.ideaRepository.save(newIdea);

        console.log(`OK: idea.service.createIdea(initiatorId:${input.initiatorId}, name:${input.name})`);
        return (newIdea);
    }

    async deleteIdea(input: {id: number}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.deleteIdea(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        console.log(`OK: idea.service.deteleIdea(${input.id})`);
        return this.ideaRepository.remove(idea);
    }
}
