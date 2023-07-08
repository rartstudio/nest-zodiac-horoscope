import { Module } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { PostLikeRepository } from './post-like.repository';
import { PostLikeExistGuard } from './post-like-exist.guard';

@Module({
  providers: [PostLikeService, PostLikeRepository, PostLikeExistGuard],
  exports: [PostLikeService, PostLikeExistGuard],
})
export class PostLikeModule {}
