import { Injectable } from '@nestjs/common';
import { UserPasswordService } from './user-password.service';
import { UserRepository } from './user-repository';
import { UserSelected } from './user.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private userPasswordService: UserPasswordService,
    private userRepository: UserRepository,
  ) {}

  async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<UserSelected> {
    // hashing password
    const hashedPassword = await this.userPasswordService.hash(password);

    const user: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      username,
    };

    return await this.userRepository.create(user);
  }

  async findOneById(id: string): Promise<UserSelected> {
    return await this.userRepository.findOneById(id);
  }

  async findOneByUsername(username: string): Promise<UserSelected> {
    return await this.userRepository.findOneByUsername(username);
  }

  async findOneByEmail(email: string): Promise<UserSelected> {
    return await this.userRepository.findOneByEmail(email);
  }
}
