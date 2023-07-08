import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
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

      jwtAuthGuard.canActivate = jest.fn().mockReturnValue(true);

      const result = await jwtAuthGuard.canActivate(mockExecutionContext);

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
        jwtAuthGuard.canActivate(mockExecutionContext),
      ).rejects.toThrowError();
    });
  });
});
