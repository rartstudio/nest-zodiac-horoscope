import { Exclude } from 'class-transformer';

export class UserLimitResponse {
  id: string;
  name: string;

  constructor(partial: Partial<UserLimitResponse>) {
    Object.assign(this, partial);
  }
}
