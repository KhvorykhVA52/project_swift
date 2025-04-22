import { Controller, Post, Body, Param, Delete, Put, UseGuards, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto) {
    const result = await this.commentService.createComment(createCommentDto);
    if (!result) {
      return {
        success: false,
        message: 'ОШИБКА: Не удалось создать комментарий (проверьте ID пользователя и идеи)'
      };
    }
    return {
      success: true,
      data: result,
      message: `УСПЕХ: Комментарий ID ${result.id} создан`
    };
  }

  @Put('edit/:id')
  //@UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    const result = await this.commentService.updateComment({
      id: +id,
      data: updateCommentDto
    });
    if (!result) {
      return {
        success: false,
        message: `ОШИБКА: Комментарий ID ${id} не найден`
      };
    }
    return {
      success: true,
      data: result,
      message: `УСПЕХ: Комментарий ID ${id} обновлен`
    };
  }

  @Delete('delete/:id')
  //@UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const success = await this.commentService.deleteComment(+id);
    return {
      success,
      message: success 
        ? `УСПЕХ: Комментарий ID ${id} удален` 
        : `ОШИБКА: Комментарий ID ${id} не найден`
    };
  }

  @Get('getBy')
  async getBy(@Body() body: {id: number}) {
    return this.commentService.getBy(body.id);
  }
}