import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPasswordService } from './user-password.service';
import { UserRepository } from './user-repository';
import { PrismaModule } from '../prisma/prisma.module';
import { UserExistGuard } from './user-exist.guard';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    PrismaService,
    UserPasswordService,
    UserRepository,
    UserExistGuard,
  ],
  exports: [UserService, UserPasswordService, UserExistGuard],
})
export class UserModule {}
