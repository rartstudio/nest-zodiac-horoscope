import { Exclude } from 'class-transformer';

export class UserResponse {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  profileUrl: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
