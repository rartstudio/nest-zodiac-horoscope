import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserProfileSelected } from './user-profile.type';

@Injectable()
export class UserProfileRepository {
  constructor(private prismaService: PrismaService) {}

  private selectedData = {
    select: {
      userId: true,
      name: true,
      gender: true,
      birthdate: true,
      height: true,
      weight: true,
      profileUrl: true,
      horoscope: true,
      zodiac: true,
    },
  };

  async update(
    userId: string,
    data: Prisma.UserProfileUpdateInput,
  ): Promise<UserProfileSelected> {
    return await this.prismaService.userProfile.update({
      where: { userId },
      data,
      ...this.selectedData,
    });
  }

  async create(
    data: Prisma.UserProfileCreateInput,
  ): Promise<UserProfileSelected> {
    return await this.prismaService.userProfile.create({
      data,
      ...this.selectedData,
    });
  }

  async get(userId: string): Promise<UserProfileSelected> {
    return await this.prismaService.userProfile.findFirst({
      where: {
        userId,
      },
      ...this.selectedData,
    });
  }
}
