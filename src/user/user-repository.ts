import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserSelected } from './user-select.type';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  private selectedData = {
    select: {
      id: true,
      name: true,
      email: true,
      countryCode: true,
      phoneNumber: true,
      emailVerifiedAt: true,
      profileUrl: true,
      password: true,
      otp: true,
      tokenReset: true,
    },
  };

  async create(
    email: string,
    name: string,
    password: string,
    countryCode: string,
    phoneNumber: string,
    username: string,
    id: string,
  ): Promise<UserSelected> {
    return await this.prismaService.user.create({
      data: {
        id,
        email,
        name,
        username,
        password,
        phoneNumber,
        countryCode,
      },
      ...this.selectedData,
    });
  }

  async findOneById(id: string): Promise<UserSelected> {
    return await this.prismaService.user.findUnique({
      where: { id },
      ...this.selectedData,
    });
  }

  async findOneByUsername(username: string): Promise<UserSelected> {
    return await this.prismaService.user.findUnique({
      where: { username },
      ...this.selectedData,
    });
  }

  async findOneByEmail(email: string): Promise<UserSelected> {
    return await this.prismaService.user.findUnique({
      where: { email },
      ...this.selectedData,
    });
  }

  async updateActivateAccountUser(id: string): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: { id },
      data: { otp: null, emailVerifiedAt: new Date() },
      ...this.selectedData,
    });
  }

  async updateProfileImage(
    id: string,
    profileUrl: string,
  ): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: { id },
      data: { profileUrl },
      ...this.selectedData,
    });
  }

  async updateResetToken(
    id: string,
    tokenReset: string | null,
  ): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: { id },
      data: { tokenReset },
      ...this.selectedData,
    });
  }

  async updatePassword(id: string, password: string): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: { id },
      data: { password },
      ...this.selectedData,
    });
  }

  async updateOtp(otp: string, id: string): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        otp,
      },
      ...this.selectedData,
    });
  }

  async updateProfile(
    id: string,
    name: string,
    phoneNumber: string,
    countryCode: string,
  ): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name,
        phoneNumber,
        countryCode,
      },
      ...this.selectedData,
    });
  }

  async updateEmail(id: string, email: string): Promise<UserSelected> {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        email,
      },
      ...this.selectedData,
    });
  }
}
