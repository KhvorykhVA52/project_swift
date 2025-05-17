import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Idea } from 'src/orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaService } from './idea.service';

@Controller('ideas')
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

    @Get('getall')
    getIdeas() {
        return this.ideaService.getAll();
    }

    @Get('getall2')
    getIdeas2() {
        return this.ideaService.getAll2();
    }

    @Get('getby/:id')
    getBy(@Param('id') body) {
        return this.ideaService.getBy(body);
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

    @Post('invite/create')
    createInvite(@Body() body) {
        return this.ideaService.createInvite(body);
    }

    @Get('invite/getby/:id')
    getInvites(@Param('id') body) {
        return this.ideaService.getIdeaInvites(body);
    }

    @Get('getallaccepted')
    getAllAccapted() {
        return this.ideaService.getAllAccepted();
    }

    @Delete('invite/cancelinvite/:id')
    cancelInvite(@Param('id') body) {
        return this.ideaService.cancelInvite({id: body});
    }

    @Post('invite/responseinvite/:id')
    responseInvite(@Param('id') id, @Body() body) {
        return this.ideaService.responseInvite(id, body.data.response)
    }
}
