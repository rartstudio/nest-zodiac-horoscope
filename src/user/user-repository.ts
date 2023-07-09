import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserSelected } from './user.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  private selectedData = {
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  };

  async create(user: Prisma.UserCreateInput): Promise<UserSelected> {
    return await this.prismaService.user.create({
      data: user,
      ...this.selectedData,
    });
  }

  async findOneById(id: string): Promise<{
    id: string;
    username: string;
    email: string;
    password: string;
  }> {
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
}
