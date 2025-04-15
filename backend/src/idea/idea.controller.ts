import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Idea } from 'src/orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
    constructor(private readonly ideaService: IdeaService) {}

    @Post('create')
    createIdea(@Body() body: CreateIdeaDto) {
        return this.ideaService.createIdea(body);
    }

    @Post('delete')
    deleteIdea(@Body() body: {id: number}) {
        return this.ideaService.deleteIdea(body);
    }

    @Get()
    getIdeas(@Body() body) {
        return this.ideaService.getIdeasBy(body);
    }

    @Post('changename')
    changeName(@Body() body) {
        return this.ideaService.changeName(body);
    }

    @Post('changeproblem')
    changeProblem(@Body() body) {
        return this.ideaService.changeProblem(body);
    }

    @Post('changesolution')
    changeSolution(@Body() body) {
        return this.ideaService.changeSolution(body);
    }

    @Post('changeresult')
    changeResult(@Body() body) {
        return this.ideaService.changeResult(body);
    }

    @Post('changeresource')
    changeResource(@Body() body) {
        return this.ideaService.changeResource(body);
    }

    @Post('changestatus')
    changeStatus(@Body() body) {
        return this.ideaService.changeStatus(body);
    }

    @Post('changecustomer')
    changeCustomer(@Body() body) {
        return this.ideaService.changeCustomer(body);
    }

}
