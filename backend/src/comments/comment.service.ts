import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../orm/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../orm/user.entity';
import { Idea } from '../orm/idea.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Idea)
    private ideaRepository: Repository<Idea>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comments | null> {
    // 1. Поиск User с отдельной проверкой
    const user = await this.userRepository.findOne({ 
      where: { id: createCommentDto.author },
      relations: ['comments']
    });
    if (!user) {
      console.log(`ОШИБКА: comment.service.createComment(): Не найден User с ID ${createCommentDto.author}`);
      return null;
    }

    // 2. Поиск Idea с отдельной проверкой
    const idea = await this.ideaRepository.findOne({ 
      where: { id: createCommentDto.idea },
      relations: ['comments']
    });
    if (!idea) {
      console.log(`ОШИБКА: comment.service.createComment(): Не найдена Idea с ID ${createCommentDto.idea}`);
      return null;
    }

    // 3. Создание комментария
    const newComment = new Comments();
    newComment.comment = createCommentDto.comment;
    newComment.grade = createCommentDto.grade;
    newComment.author = user;
    newComment.idea = idea;

    // 4. Сохранение и обновление связей
    const savedComment = await this.commentsRepository.save(newComment);
    
    // Добавляем в Idea
    if (!idea.comments) idea.comments = [];
    idea.comments.push(savedComment);
    await this.ideaRepository.save(idea);

    // Добавляем в User
    if (!user.comments) user.comments = [];
    user.comments.push(savedComment);
    await this.userRepository.save(user);

    console.log(`УСПЕХ: comment.service.createComment(): Создан комментарий ID ${savedComment.id} (User ID ${user.id}, Idea ID ${idea.id})`);
    return savedComment;
  }

  async updateComment(input: { id: number; data: UpdateCommentDto }): Promise<Comments | null> {
    const comment = await this.commentsRepository.findOneBy({ id: input.id });
    if (!comment) {
      console.log(`ОШИБКА: comment.service.updateComment(): Не найден комментарий ID ${input.id}`);
      return null;
    }

    // Обновление только указанных полей
    if (input.data.comment !== undefined) comment.comment = input.data.comment;
    if (input.data.grade !== undefined) comment.grade = input.data.grade;

    const updatedComment = await this.commentsRepository.save(comment);
    console.log(`УСПЕХ: comment.service.updateComment(): Обновлен комментарий ID ${input.id}`);
    return updatedComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['idea', 'author']
    });
    if (!comment) {
      console.log(`ОШИБКА: comment.service.deleteComment(): Не найден комментарий ID ${id}`);
      return false;
    }

    // Удаление из Idea
    if (comment.idea?.comments) {
      comment.idea.comments = comment.idea.comments.filter(c => c.id !== id);
      await this.ideaRepository.save(comment.idea);
    }

    // Удаление из User
    if (comment.author?.comments) {
      comment.author.comments = comment.author.comments.filter(c => c.id !== id);
      await this.userRepository.save(comment.author);
    }

    await this.commentsRepository.delete(id);
    console.log(`УСПЕХ: comment.service.deleteComment(): Удален комментарий ID ${id}`);
    return true;
  }
}