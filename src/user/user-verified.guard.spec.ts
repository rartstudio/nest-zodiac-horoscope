import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserVerifiedGuard } from './user-verified.guard';

describe('UserVerifiedGuard', () => {
  let guard: UserVerifiedGuard;
  let mockContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVerifiedGuard],
    }).compile();

    guard = module.get<UserVerifiedGuard>(UserVerifiedGuard);

    const mockRequest = {
      user: {
        isEmailVerified: true,
      },
    };
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  });

  it('should allow access when user is verified', async () => {
    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should deny access when user is not verified', async () => {
    const mockRequest = {
      user: {
        isEmailVerified: null,
      },
    };
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(false);
  });
});
