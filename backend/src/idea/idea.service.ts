import { Injectable } from '@nestjs/common';
import { Idea } from 'src/orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { User } from 'src/orm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusIdea } from 'src/common/types';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}
    
    async createIdea(input: CreateIdeaDto ) {
        const user = await this.userRepository.findOne({
            where: { id: input.initiatorId },
            relations: ['initiatedIdeas'],
        });

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

        const savedIdea = await this.ideaRepository.save(newIdea);
        
        user.initiatedIdeas.push(newIdea);

        this.userRepository.save(user);

        console.log(`OK: idea.service.createIdea(initiatorId:${input.initiatorId}, name:${input.name})`);

        const miniIdea = this.ideaRepository.findOne({
            where: {id: savedIdea.id},
            relations: ['comments', 'comments.author'],
            loadEagerRelations: false,
        })
        
        return miniIdea;
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

    async getAll() {
        try{
            const ideas = await this.ideaRepository.find();
            console.log(`OK: idea.service.getAll()`);
            return ideas;
        } catch(error) {
            console.log(`ERROR: idea.service.getAll(): ${error}`);
            return `ERROR`;
        }
    }
    //просто getAll() пока не используется - позже возможно надо будет его удалить
    async getAll2() {
        try{
            const ideas = await this.ideaRepository.find({
                relations: ['comments', 'comments.author'],
                loadEagerRelations: false,
            });
            console.log(`OK: idea.service.getAll2()`);
            return ideas;
        } catch(error) {
            console.log(`ERROR: idea.service.getAll2(): ${error}`);
            return `ERROR`;
        }
    }

    async getBy(id: number) {
        try{
            const user = await this.userRepository.findOne({
                where: {id: id},
                relations: ['initiatedIdeas', 'initiatedIdeas.comments'],
            })
            if (!user) {
                console.log(`ERROR: idea.service.getBy(): не найден User при User.id=${id}`);
                return `ERROR`;
            }
            
            console.log(`OK: idea.service.getBy(${id})`);

            if (!user.initiatedIdeas) {
                return [];
            }
            
            return user.initiatedIdeas;
        } catch(error) {
            console.log(`ERROR: idea.service.getBy(): ${error}`);
            return `ERROR`;
        }
    }

    async changeName(input: {id: number, data: string}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeName(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        idea.name = input.data;

        console.log(`OK: idea.service.changeName(${input.id})`);
        return this.ideaRepository.save(idea);
    }

    async changeProblem(input: {id: number, data: string}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeProblem(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        idea.problem = input.data;

        console.log(`OK: idea.service.changeProblem(${input.id})`);
        return this.ideaRepository.save(idea);
    }

    async changeSolution(input: {id: number, data: string}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeSolution(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        idea.solution = input.data;

        console.log(`OK: idea.service.changeSolution(${input.id})`);
        return this.ideaRepository.save(idea);
    }

    async changeResult(input: {id: number, data: string}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeResult(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        idea.result = input.data;

        console.log(`OK: idea.service.changeResult(${input.id})`);
        return this.ideaRepository.save(idea);
    }

    async changeResource(input: {id: number, data: string}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeResource(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        idea.resource = input.data;

        console.log(`OK: idea.service.changeResource(${input.id})`);
        return this.ideaRepository.save(idea);
    }

    async changeStatus(input: {id: number, data: StatusIdea}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeStatus(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        idea.status = input.data;

        console.log(`OK: idea.service.changeStatus(${input.id})`);
        return this.ideaRepository.save(idea);
    }

    async changeCustomer(input: {id: number, customerId: number}) {
        const idea = await this.ideaRepository.findOneBy({id: input.id});

        if (!idea) {
            console.log(`ERROR: idea.service.changeCustomer(): не найден Idea при Idea.id=${input.id}`);
            return `ERROR`;
        }

        if (input.customerId == -1) {
            idea.customer = null;
            this.ideaRepository.save(idea);

            console.log(`OK: idea.service.addCustomer(id:${input.id}, customerId:${input.customerId})`);
            return `OK`;
        }

        const user = await this.userRepository.findOneBy({id: input.customerId });

        if (!user) {
            console.log(`ERROR: idea.service.createCustomer(): не найден User при User.id=${input.customerId}`);
            return `ERROR`;
        }

        idea.customer = user;

        this.ideaRepository.save(idea);

        console.log(`OK: idea.service.addCustomer(id:${input.id}, customerId:${input.customerId})`);
        return `OK`;
    }
}
