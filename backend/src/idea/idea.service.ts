import { Injectable } from '@nestjs/common';
import { Idea } from 'src/orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { User } from 'src/orm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Competence, StatusIdea } from 'src/common/types';
import { IdeaInvite } from 'src/orm/idea-invite.entity';
import { Team } from 'src/orm/team.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(IdeaInvite)
        private ideaInviteRepository: Repository<IdeaInvite>,
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
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
                relations: ['initiator', 'comments', 'comments.author'],
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

    async createInvite(input: {ideaId: number, teamId: number, isInitiatorInviter: boolean}) {
        const idea = await this.ideaRepository.findOneBy({id: input.ideaId});

        if (!idea) {
            console.log(`ERROR: idea.service.createInvite(): не найден Idea при Idea.id=${input.ideaId}`);
            return null;
        }

        const team = await this.teamRepository.findOneBy({id: input.teamId});

        if (!team) {
            console.log(`ERROR: idea.service.createInvite(): не найден Team при Team.id=${input.teamId}`);
            return null;
        }

        const invite = await this.ideaInviteRepository.findOne({
            where: {idea: {id: input.ideaId}, team: {id: input.teamId}},
        })

        if (invite) {
            console.log(`ERROR: idea.service.createInvite(): Уже существует такой Invite: Invite.id=${invite.id}`);
            return null;
        }

        const ideaInvite = new IdeaInvite();
        
        ideaInvite.idea = idea;
        ideaInvite.team = team;
        ideaInvite.isInitiatorInviter = input.isInitiatorInviter;
        ideaInvite.status = 'Ожидание';

        const response = await this.ideaInviteRepository.save(ideaInvite);
        console.log(`OK: idea.service.createInvite(ideaId=${input.ideaId}); teamId=${input.teamId}; isInitiatorInviter=${input.isInitiatorInviter}`);
        return true;
    }

    async getIdeaInvites(id: number) {
        const idea = await this.ideaRepository.find({
            where: {id: id},
        });

        if (!idea) {
            console.log(`ERROR: idea.service.getIdeaInvites(): не найден Idea при Idea.id=${id}`);
            return null;
        }

        const invite = await this.ideaInviteRepository.find({
            where: {idea: {id: id}},
            relations: ['team.owner']
        });

        console.log(`OK: idea.service.getIdeaInvites(id=${id})`);

        if (!invite) {
            return null;
        }

        return invite;
    }

    async getAllAccepted() {
        try{
            const ideas = await this.ideaRepository.find({
                relations: ['initiator', 'team'],
                loadEagerRelations: false,
                where: {status: In([StatusIdea.searchTeam, StatusIdea.teamIsFinded])},
            });
            console.log(`OK: idea.service.getAllAccepted()`);
            return ideas;
        } catch(error) {
            console.log(`ERROR: idea.service.getAllAccepted(): ${error}`);
            return `ERROR`;
        }
    }

    async cancelInvite(input: {id: number}) {
        const invite = await this.ideaInviteRepository.findOne({
            where: {id: input.id}
        })

        if (!invite) {
            console.log(`ERROR: idea.service.cancelInvite(): не найден ideaInvite при ideaInvite.id=${input.id}`);
            return false;
        }

        await this.ideaInviteRepository.remove(invite);

        console.log(`OK: idea.service.cancelInvite(${input.id})`);
        return true;
    }

    async responseInvite(id: number, response: string) {
        const invite = await this.ideaInviteRepository.findOne({
            where: {id: id}
        });

        if (!invite) {
            console.log(`ERROR: idea.service.responseInvite(): не найден Invite при Invite.id=${id}`);
            return false;
        }

        invite.status = response;

        if (response == 'Принято') {
            const idea = await this.ideaRepository.findOne({
                where: {id: invite.idea.id}
            });
    
            if (!idea) {
                console.log(`!!!CRITICAL ERROR!!!: idea.service.responseInvite(): не найден Idea при Invite.id=${id}`);
                return false;
            }

            const team = await this.teamRepository.findOne({
                where: {id: invite.team.id}
            });

            if (!team) {
                console.log(`!!!CRITICAL ERROR!!!: idea.service.responseInvite(): не найден Team при Invite.id=${id}`);
                return false;
            }

            idea.status = StatusIdea.teamIsFinded;
            idea.team = team;

            team.idea = idea;

            await this.ideaRepository.save(idea);
            await this.teamRepository.save(team);
        }

        await this.ideaInviteRepository.save(invite);
        
        console.log(`OK: idea.service.responseInvite(id=${id};response=${response})`);

        return true;
    }

    async updateStack(id: number, stack: Competence[]) {
        const idea = await this.ideaRepository.findOne({
            where: {id: id}
        })

        if (!idea) {
            console.log(`ERROR: idea.service.updateStack(): не найден Idea при Idea.id=${id}`);
            return null;
        }

        idea.stack = stack;
        
        console.log(`OK: idea.service.updateStack(id=${id})`);
        return await this.ideaRepository.save(idea);
    }

    async getStack(id: number) {
        const idea = await this.ideaRepository.findOne({
            where: {id: id},
        })

        if (!idea) {
            console.log(`ERROR: idea.service.getIdea(): не найден Idea при Idea.id=${id}`);
            return null;
        }

        console.log(`OK: idea.service.getIdea(id=${id})`);
        return idea.stack || [];
    }

    async searchInvite(input: {ideaId: number, teamId: number}) {
        const team = await this.teamRepository.findOne({
            where: {id: input.teamId}
        });

        if (!team) {
            console.log(`ERROR: idea.service.searchInvite(): не найден Team при Team.id=${input.teamId}`);
            return null;
        }

        const idea = await this.ideaRepository.findOne({
            where: {id: input.ideaId}
        });

        if (!idea) {
            console.log(`ERROR: idea.service.searchInvite(): не найден Idea при Idea.id=${input.ideaId}`);
            return null;
        }

        const invite = await this.ideaInviteRepository.findOne({
            where: {idea: {id: idea.id}, team: {id: team.id}}
        });

        if (!invite) {
            console.log(`OK: idea.service.searchInvite(ideaId=${input.ideaId}, teamId=${input.teamId})`);
            return false;
        }

        console.log(`OK: idea.service.searchInvite(ideaId=${input.ideaId}, teamId=${input.teamId})`);
        return true;
    }
}
