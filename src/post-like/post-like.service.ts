import { Injectable } from '@nestjs/common';
import { PostLikeRepository } from './post-like.repository';

@Injectable()
export class PostLikeService {
  constructor(private readonly postLikeRepository: PostLikeRepository) {}

  async findOne(postId: string, userId: string) {
    return await this.postLikeRepository.findOne(postId, userId);
  }

  async create(postId: string, userId: string) {
    return await this.postLikeRepository.create(postId, userId);
  }

  async delete(postId: string, userId: string) {
    return await this.postLikeRepository.delete(postId, userId);
  }
}
