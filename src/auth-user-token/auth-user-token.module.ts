import { Module } from '@nestjs/common';
import { AuthUserTokenController } from './auth-user-token.controller';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenModule, UserModule],
  controllers: [AuthUserTokenController],
})
export class AuthUserTokenModule {}
