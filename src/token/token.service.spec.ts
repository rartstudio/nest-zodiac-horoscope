import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
      imports: [
        JwtModule.register({}),
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [
            () => ({
              JWT_SECRET: 'asdfasdfs',
              JWT_EXPIRATION_TIME: 10000,
              JWT_REFRESH_SECRET: 'asdasdasda',
              JWT_REFRESH_EXPIRATION_TIME: 30000,
            }),
          ],
        }),
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should return generated token reset', () => {
    const result: string = service.generateTokenReset();
    expect(result).toBeTruthy();
  });

  it('should return generated access token', async () => {
    const result: string = await service.generateAccessToken(
      'asdasd-asdasd-asdasd',
    );
    expect(result).toBeTruthy();
  });

  it('should return generated refresh token', async () => {
    const result: string = await service.generateRefreshToken(
      'asdasd-asdasd-asdasd',
    );
    expect(result).toBeTruthy();
  });
});
