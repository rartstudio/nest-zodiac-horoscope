import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import { v4 as uuidv4 } from 'uuid';
import { PostSelected } from './post-select.type';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(userId: string, postDto: PostDto): Promise<PostSelected> {
    const { content } = postDto;
    const uuid = uuidv4();
    return await this.postRepository.create(userId, content, uuid);
  }

  async findOneByUserId(userId: string): Promise<PostSelected[]> {
    return await this.postRepository.getByUserId(userId);
  }

  async findOneByPostIdAndUserId(
    postId: string,
    userId: string,
  ): Promise<PostSelected> {
    return await this.postRepository.getByPostIdAndUserId(postId, userId);
  }

  async findOne(postId: string): Promise<PostSelected> {
    return await this.postRepository.getDetail(postId);
  }

  async findAll(): Promise<PostSelected[]> {
    return await this.postRepository.getAll();
  }

  async delete(postId: string) {
    return await this.postRepository.delete(postId);
  }

  async archive(postId: string): Promise<PostSelected> {
    return await this.postRepository.archive(postId);
  }
}
