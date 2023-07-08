import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserPasswordService } from './user-password.service';
import { UserRepository } from './user-repository';
import { UserSelected } from './user-select.type';

@Injectable()
export class UserService {
  constructor(
    private userPasswordService: UserPasswordService,
    private userRepository: UserRepository,
  ) {}

  async createUser(
    email: string,
    name: string,
    password: string,
    countryCode: string,
    phoneNumber: string,
    username: string,
  ): Promise<UserSelected> {
    // create dto to create user
    const uuid = uuidv4();

    // hashing password
    const hashedPassword = await this.userPasswordService.hash(password);

    return await this.userRepository.create(
      email,
      name,
      hashedPassword,
      countryCode,
      phoneNumber,
      username,
      uuid,
    );
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

  async updateActivateAccountUser(id: string): Promise<UserSelected> {
    return await this.userRepository.updateActivateAccountUser(id);
  }

  async updateResetToken(
    id: string,
    tokenReset: string | null,
  ): Promise<UserSelected> {
    return await this.userRepository.updateResetToken(id, tokenReset);
  }

  async updatePassword(id: string, password: string): Promise<UserSelected> {
    // hash password
    const hashedPassword = await this.userPasswordService.hash(password);

    return await this.userRepository.updatePassword(id, hashedPassword);
  }

  async updateOtp(otp: string, id: string): Promise<UserSelected> {
    return await this.userRepository.updateOtp(otp, id);
  }

  async updateProfileImage(
    id: string,
    profileUrl: string,
  ): Promise<UserSelected> {
    return await this.userRepository.updateProfileImage(id, profileUrl);
  }

  async updateProfile(
    id: string,
    name: string,
    phoneNumber: string,
    countryCode: string,
  ): Promise<UserSelected> {
    return await this.userRepository.updateProfile(
      id,
      name,
      phoneNumber,
      countryCode,
    );
  }

  async updateEmail(id: string, email: string): Promise<UserSelected> {
    return await this.userRepository.updateEmail(id, email);
  }
}
