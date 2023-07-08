import { Exclude } from 'class-transformer';
import { UserLimitResponse } from '../../user/response/user-limit-response.dto';
import { PostLikeResponse } from '../../post-like/response/post-like.response';
import { PostCommentResponse } from '../../post-comment/response/post-comment.response';

export class PostResponse {
  id: string;
  content: string;
  user: UserLimitResponse;
  likes: PostLikeResponse[];
  comments: PostCommentResponse[];

  constructor(partial: Partial<PostResponse>) {
    Object.assign(this, partial);
  }
}
