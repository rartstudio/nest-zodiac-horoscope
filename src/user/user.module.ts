import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPasswordService } from './user-password.service';
import { UserRepository } from './user-repository';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserExistGuard } from './user-exist.guard';
import { UserVerifiedGuard } from './user-verified.guard';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    PrismaService,
    UserPasswordService,
    UserRepository,
    UserExistGuard,
    UserVerifiedGuard,
  ],
  controllers: [UserController],
  exports: [
    UserService,
    UserPasswordService,
    UserExistGuard,
    UserVerifiedGuard,
  ],
})
export class UserModule {}
