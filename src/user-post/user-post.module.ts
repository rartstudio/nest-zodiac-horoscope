import { Module } from '@nestjs/common';
import { UserPostController } from './user-post.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { UserPostExistGuard } from './user-post.exist.guard';

@Module({
  imports: [UserModule, PostModule],
  controllers: [UserPostController],
  providers: [UserPostExistGuard],
})
export class UserPostModule {}
