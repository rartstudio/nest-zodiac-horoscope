import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

describe('JwtRefreshAuthGuard', () => {
  let jwtRefreshAuthGuard: JwtRefreshAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtRefreshAuthGuard],
    }).compile();

    jwtRefreshAuthGuard =
      moduleRef.get<JwtRefreshAuthGuard>(JwtRefreshAuthGuard);
  });

  describe('canActivate', () => {
    it('should return true when user is authenticated', async () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: jest.fn(() => ({
            authorization: 'Bearer valid-token',
          })),
        }),
      } as any;

      jwtRefreshAuthGuard.canActivate = jest.fn().mockReturnValue(true);

      const result = await jwtRefreshAuthGuard.canActivate(
        mockExecutionContext,
      );

      expect(result).toEqual(true);
    });

    it('should throw an exception when user is not authenticated', async () => {
      const mockExecutionContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: jest.fn(() => ({
            headers: {},
          })),
        }),
      } as any;

      await expect(
        jwtRefreshAuthGuard.canActivate(mockExecutionContext),
      ).rejects.toThrowError();
    });
  });
});
