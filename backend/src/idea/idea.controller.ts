import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Idea } from 'src/orm/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
    constructor(private readonly ideaService: IdeaService) {}

    @Post('create')
    createIdea(@Body() createIdeaDto: CreateIdeaDto) {
        return this.ideaService.createIdea(createIdeaDto);
    }
}
