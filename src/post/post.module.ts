import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostExistGuard } from './post-exist.guard';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PostExistGuard],
  exports: [PostService, PostExistGuard],
})
export class PostModule {}
