import { Gender, Horoscope, Zodiac } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserProfileResponse {
  userId: string;
  name: string;
  gender: Gender;
  birthDate: Date;
  height: number;
  weight: number;
  profileUrl: string;
  horoscope: Horoscope;
  zodiac: Zodiac;

  constructor(partial: Partial<UserProfileResponse>) {
    Object.assign(this, partial);
  }
}
