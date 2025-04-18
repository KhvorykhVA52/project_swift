import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentsController } from './comments.controller';
import { Comments } from '../orm/comment.entity';
import { User } from '../orm/user.entity';
import { Idea } from '../orm/idea.entity'; // Добавьте импорт

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments, User, Idea]), // Добавьте Idea в forFeature
  ],
  providers: [CommentService],
  controllers: [CommentsController],
  exports: [CommentService],
})
export class CommentModule {}