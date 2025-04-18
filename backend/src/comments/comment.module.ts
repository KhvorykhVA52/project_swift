import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentsController } from './comments.controller';
import { Comments } from '../orm/comment.entity';
import { User } from 'src/orm/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, User])],
  providers: [CommentService],
  controllers: [CommentsController],
  exports: [CommentService], // Экспортируем сервис, чтобы он был доступен в других модулях
})
export class CommentModule {}
