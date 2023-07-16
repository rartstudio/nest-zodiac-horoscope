import { Test } from '@nestjs/testing';
import { UserRepository } from './user-repository';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: 'dafsf-dfsafasf-asdfasdf',
    email: 'testing@gmail.com',
    username: 'testing',
    password: '1sgsfgdsgsdertse',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find one by id', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userRepository.findOneById(
        'dafsf-dfsafasf-asdfasdf',
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.findOneById(
        'dafsf-dfsafasf-asdfasdfa',
      );

      expect(result).toEqual(null);
    });
  });

  describe('find one by username', () => {
    it('should return a user by username', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userRepository.findOneByUsername('testing');

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.findOneByUsername('testing');

      expect(result).toEqual(null);
    });
  });

  describe('find one by email', () => {
    it('should return a user by email', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userRepository.findOneByEmail('testing@gmail.com');

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.findOneByEmail('testing@gmail.com');

      expect(result).toEqual(null);
    });
  });

  describe('create user', () => {
    it('should create user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const { email, username, password } = mockUser;

      const user: Prisma.UserCreateInput = {
        email,
        password,
        username,
      };

      const result = await userRepository.create(user);

      expect(result.id).toEqual(mockUser.id);
    });
  });
});
