import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../orm/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../orm/user.entity';
import { Idea } from '../orm/idea.entity';

// Тип для возвращаемых данных без циклических зависимостей
type CommentResponse = Omit<Comments, 'author' | 'idea'> & {
  author: { id: number };
  idea: { id: number };
};

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

  async createComment(createCommentDto: CreateCommentDto): Promise<CommentResponse | null> {
    try {
      // 1. Поиск User и Idea (только ID)
      const user = await this.userRepository.findOne({ 
        where: { id: createCommentDto.author },
        select: ['id']
      });
      if (!user) {
        console.log(`ОШИБКА: Не найден User с ID ${createCommentDto.author}`);
        return null;
      }

      const idea = await this.ideaRepository.findOne({ 
        where: { id: createCommentDto.idea },
        select: ['id']
      });
      if (!idea) {
        console.log(`ОШИБКА: Не найдена Idea с ID ${createCommentDto.idea}`);
        return null;
      }

      // 2. Создание комментария
      const newComment = this.commentsRepository.create({
        ...createCommentDto,
        author: { id: user.id }, // Используем только ID
        idea: { id: idea.id }    // Используем только ID
      });

      // 3. Сохранение
      const savedComment = await this.commentsRepository.save(newComment);

      // 4. Обновление связей через QueryBuilder (без рекурсии)
      await Promise.all([
        this.ideaRepository
          .createQueryBuilder()
          .relation(Idea, 'comments')
          .of(idea.id)
          .add(savedComment.id),
        this.userRepository
          .createQueryBuilder()
          .relation(User, 'comments')
          .of(user.id)
          .add(savedComment.id)
      ]);

      console.log(`УСПЕХ: Создан комментарий ID ${savedComment.id}`);
      
      // 5. Возвращаем данные без циклических ссылок
      return {
        ...savedComment,
        author: { id: user.id },
        idea: { id: idea.id }
      };
    } catch (error) {
      console.log(`ОШИБКА: ${error.message}`);
      return null;
    }
  }

  async updateComment(input: { id: number; data: UpdateCommentDto }): Promise<CommentResponse | null> {
    try {
      const comment = await this.commentsRepository.findOne({ 
        where: { id: input.id },
        relations: ['author', 'idea'],
        loadEagerRelations: false
      });
      
      if (!comment) {
        console.log(`ОШИБКА: Комментарий ID ${input.id} не найден`);
        return null;
      }

      if (input.data.comment !== undefined) comment.comment = input.data.comment;
      if (input.data.grade !== undefined) comment.grade = input.data.grade;

      const updatedComment = await this.commentsRepository.save(comment);
      
      console.log(`УСПЕХ: Обновлен комментарий ID ${input.id}`);
      return {
        ...updatedComment,
        author: { id: comment.author.id },
        idea: { id: comment.idea.id }
      };
    } catch (error) {
      console.log(`ОШИБКА: ${error.message}`);
      return null;
    }
  }

  async deleteComment(id: number): Promise<boolean> {
    try {
      const comment = await this.commentsRepository.findOne({ 
        where: { id },
        relations: ['author', 'idea'],
        select: ['id']
      });

      if (!comment) {
        console.log(`ОШИБКА: Комментарий ID ${id} не найден`);
        return false;
      }

      await Promise.all([
        this.ideaRepository
          .createQueryBuilder()
          .relation(Idea, 'comments')
          .of(comment.idea)
          .remove(id),
        this.userRepository
          .createQueryBuilder()
          .relation(User, 'comments')
          .of(comment.author)
          .remove(id)
      ]);

      await this.commentsRepository.delete(id);
      console.log(`УСПЕХ: Удален комментарий ID ${id}`);
      return true;
    } catch (error) {
      console.log(`ОШИБКА: ${error.message}`);
      return false;
    }
  }
}