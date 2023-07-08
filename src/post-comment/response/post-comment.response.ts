import { UserLimitResponse } from '../../user/response/user-limit-response.dto';

export class PostCommentResponse {
  id: string;
  comment: string;
  user: UserLimitResponse;

  constructor(partial: Partial<PostCommentResponse>) {
    Object.assign(this, partial);
  }
}
