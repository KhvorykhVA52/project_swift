import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../orm/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/orm/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comments> {
    const user = await this.userRepository.findOneBy({id: createCommentDto.author });

    if (!user) {
        throw new Error(``);
    }

    const newComments = new Comments();

    Object.assign(newComments, createCommentDto);
    newComments.author = user;

    const comment = this.commentsRepository.create(newComments);
    return this.commentsRepository.save(comment);
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto): Promise<Comments> {
    await this.commentsRepository.update(id, updateCommentDto);
    const updatedComment = await this.commentsRepository.findOne({ where: { id } });
    if (!updatedComment) {
      throw new Error(`Comment with ID ${id} not found`);
    }
    return updatedComment;
  }

  async deleteComment(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
