import { Module } from '@nestjs/common';
import { UserPostCommentController } from './user-post-comment.controller';
import { UserPostCommentExistGuard } from './user-post-comment-exist.guard';
import { PostCommentModule } from '../post-comment/post-comment.module';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [UserModule, PostCommentModule, PostModule],
  controllers: [UserPostCommentController],
  providers: [UserPostCommentExistGuard],
})
export class UserPostCommentModule {}
