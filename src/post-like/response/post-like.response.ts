import { UserLimitResponse } from '../../user/response/user-limit-response.dto';

export class PostLikeResponse {
  id: number;
  user: UserLimitResponse;

  constructor(partial: Partial<PostLikeResponse>) {
    Object.assign(this, partial);
  }
}
