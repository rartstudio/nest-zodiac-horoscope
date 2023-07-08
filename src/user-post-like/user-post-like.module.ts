import { Module } from '@nestjs/common';
import { UserPostLikeController } from './user-post-like.controller';
import { PostLikeModule } from '../post-like/post-like.module';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostLikeModule, UserModule, PostModule],
  controllers: [UserPostLikeController],
})
export class UserPostLikeModule {}
