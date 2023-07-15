import { Injectable, HttpStatus } from '@nestjs/common';
import { UserProfileRepository } from './user-profile.repository';
import { UserProfileDto } from './dto/user-profile.dto';
import { Horoscope, Prisma, Zodiac } from '@prisma/client';
import { UserProfileSelected } from './user-profile.type';
import { RepositoryNotFoundException } from '../repository-not-found-exception';
import { HoroscopeService } from '../horoscope/horoscope.service';
import { ZodiacService } from '../zodiac/zodiac.service';
import { FileUpload } from '../storage/TFile';

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileRepository: UserProfileRepository,
    private horoscopeService: HoroscopeService,
    private zodiacService: ZodiacService,
  ) {}

  convertToDateObj(date: string) {
    const dateString = date;
    const [year, month, day] = dateString.split('-');

    // JavaScript months are zero-based (0-11), so subtract 1 from the month value
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  async create(
    userProfileDto: UserProfileDto,
    userId: string,
    image: FileUpload,
  ): Promise<UserProfileSelected> {
    const { name, gender, birthDate, height, weight } = userProfileDto;

    const date = this.convertToDateObj(birthDate);

    const horoscope: Horoscope = this.horoscopeService.checkHoroscope(
      new Date(birthDate),
    );

    const zodiac: Zodiac = this.zodiacService.checkZodiac(
      parseInt(birthDate.substring(0, 4)),
    );

    const profile: Prisma.UserProfileCreateInput = {
      name,
      gender,
      birthdate: date,
      height,
      weight,
      profileUrl: image.filename,
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
    image: FileUpload,
  ): Promise<UserProfileSelected> {
    const { name, gender, birthDate, height, weight } = userProfileDto;

    const date = this.convertToDateObj(birthDate);

    const horoscope: Horoscope = this.horoscopeService.checkHoroscope(
      new Date(birthDate),
    );
    const zodiac: Zodiac = this.zodiacService.checkZodiac(
      parseInt(birthDate.substring(0, 4)),
    );

    const profile: Prisma.UserProfileUpdateInput = {
      name,
      gender,
      birthdate: date,
      height,
      weight,
      profileUrl: image.filename,
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
