import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserExistGuard } from './user-exist.guard';
import { UserService } from '../user/user.service';
import { mock } from 'jest-mock-extended';
import { Request } from 'express';
import { User } from '@prisma/client';

describe('UserExistGuard', () => {
  let guard: UserExistGuard;
  let userService: UserService;
  let mockContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserExistGuard,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<UserExistGuard>(UserExistGuard);
    userService = module.get<UserService>(UserService);

    const mockRequest = mock<Request>({
      user: {
        email: 'testing@gmail.com',
      },
    });
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  });

  it('should allow access when the user exists', async () => {
    const mockUser: User = {
      id: 'dafsf-dfsafasf-asdfasdf',
      email: 'testing@gmail.com',
      username: 'testing',
      password: '1sgsfgdsgsdertse',
      createdAt: new Date('2021-06-19T18:00:00.000Z'),
      updatedAt: new Date('2021-06-19T18:00:00.000Z'),
    };
    jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);

    const result = await guard.canActivate(mockContext);

    expect(userService.findOneByEmail).toHaveBeenCalledWith(
      expect.stringContaining('testing@gmail.com'),
    );
    expect(result).toBe(true);
  });

  it('should throw NotFoundException when the user does not exist', async () => {
    jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

    await expect(guard.canActivate(mockContext)).rejects.toThrowError(
      NotFoundException,
    );

    expect(userService.findOneByEmail).toHaveBeenCalledWith(
      expect.stringContaining('testing@gmail.com'),
    );
  });
});
