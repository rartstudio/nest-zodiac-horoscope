import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserJWTPayload } from '../user/user-jwt.payload';

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  generateTokenReset(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async generateAccessToken(id: string): Promise<string> {
    const payload: UserJWTPayload = {
      id,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async generateRefreshToken(id: string): Promise<string> {
    const payload: UserJWTPayload = {
      id,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }
}
