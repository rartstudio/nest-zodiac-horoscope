import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
