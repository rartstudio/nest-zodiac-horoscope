import { Injectable } from '@nestjs/common';
import { PostCommentRepository } from './post-comment.repository';
import { PostCommentDto } from './dto/post-comment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostCommentService {
  constructor(private readonly postCommentRepository: PostCommentRepository) {}

  async findOneByCommentIdAndPostIdAndUserId(
    commentId: string,
    postId: string,
    userId: string,
  ) {
    return await this.postCommentRepository.findOne(commentId, postId, userId);
  }

  async create(postCommentDto: PostCommentDto, userId: string, postId: string) {
    const { content } = postCommentDto;
    const uuid = uuidv4();
    return await this.postCommentRepository.create(
      postId,
      userId,
      uuid,
      content,
    );
  }

  async delete(commentId: string) {
    return await this.postCommentRepository.delete(commentId);
  }
}
