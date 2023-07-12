import { Injectable, HttpStatus } from '@nestjs/common';
import { UserProfileRepository } from './user-profile.repository';
import { UserProfileDto } from './dto/user-profile.dto';
import { Horoscope, Prisma, Zodiac } from '@prisma/client';
import { UserProfileSelected } from './user-profile.type';
import { RepositoryNotFoundException } from '../repository-not-found-exception';

@Injectable()
export class UserProfileService {
  constructor(private userProfileRepository: UserProfileRepository) {}

  async create(
    userProfileDto: UserProfileDto,
    userId: string,
    horoscope: Horoscope,
    zodiac: Zodiac,
  ): Promise<UserProfileSelected> {
    const { name, gender, birthDate, height, weight, image } = userProfileDto;

    const profile: Prisma.UserProfileCreateInput = {
      name,
      gender,
      birthdate: birthDate,
      height,
      weight,
      profileUrl: image,
      horoscope,
      zodiac,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return await this.userProfileRepository.create(profile);
  }

  async update(
    userProfileDto: UserProfileDto,
    userId: string,
    horoscope: Horoscope,
    zodiac: Zodiac,
  ): Promise<UserProfileSelected> {
    const { name, gender, birthDate, height, weight, image } = userProfileDto;

    const profile: Prisma.UserProfileUpdateInput = {
      name,
      gender,
      birthdate: birthDate,
      height,
      weight,
      profileUrl: image,
      horoscope,
      zodiac,
    };

    return await this.userProfileRepository.update(userId, profile);
  }

  async get(userId: string): Promise<UserProfileSelected> {
    const result = await this.userProfileRepository.get(userId);
    if (result == null) {
      throw new RepositoryNotFoundException(
        'Profile Not Found',
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }
}
