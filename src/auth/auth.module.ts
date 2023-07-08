import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    JwtRefreshAuthGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
