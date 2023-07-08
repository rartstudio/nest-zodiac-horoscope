import { Test } from '@nestjs/testing';
import { UserRepository } from './user-repository';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

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
      const mockUser: User = {
        id: 'dafsf-dfsafasf-asdfasdf',
        name: 'testing',
        email: 'testing@gmail.com',
        username: 'testing',
        password: '1sgsfgdsgsdertse',
        phoneNumber: '8281231221',
        countryCode: '+62',
        emailVerifiedAt: new Date(),
        otp: null,
        tokenReset: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userRepository.findOneById(
        'dafsf-dfsafasf-asdfasdf',
      );

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'dafsf-dfsafasf-asdfasdf' },
      });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.findOneById(
        'dafsf-dfsafasf-asdfasdfa',
      );

      expect(result).toEqual(null);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'dafsf-dfsafasf-asdfasdfa' },
      });
    });
  });

  describe('find one by username', () => {
    it('should return a user by username', async () => {
      const mockUser: User = {
        id: 'dafsf-dfsafasf-asdfasdf',
        name: 'testing',
        email: 'testing@gmail.com',
        username: 'testing',
        password: '1sgsfgdsgsdertse',
        phoneNumber: '8281231221',
        countryCode: '+62',
        emailVerifiedAt: new Date(),
        otp: null,
        tokenReset: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userRepository.findOneByUsername('testing');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testing' },
      });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.findOneByUsername('testing');

      expect(result).toEqual(null);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testing' },
      });
    });
  });

  describe('find one by email', () => {
    it('should return a user by email', async () => {
      const mockUser: User = {
        id: 'dafsf-dfsafasf-asdfasdf',
        name: 'testing',
        email: 'testing@gmail.com',
        username: 'testing',
        password: '1sgsfgdsgsdertse',
        phoneNumber: '8281231221',
        countryCode: '+62',
        emailVerifiedAt: new Date(),
        otp: null,
        tokenReset: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userRepository.findOneByEmail('testing@gmail.com');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'testing@gmail.com' },
      });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.findOneByEmail('testing@gmail.com');

      expect(result).toEqual(null);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'testing@gmail.com' },
      });
    });
  });

  describe('create user', () => {
    const mockUser: User = {
      id: 'dafsf-dfsafasf-asdfasdf',
      name: 'testing',
      email: 'testing@gmail.com',
      username: 'testing',
      password: '1sgsfgdsgsdertse',
      phoneNumber: '8281231221',
      countryCode: '+62',
      emailVerifiedAt: new Date(),
      otp: null,
      tokenReset: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const { name, email, id, username, password, phoneNumber, countryCode } =
        mockUser;

      const result = await userRepository.create(
        email,
        name,
        password,
        countryCode,
        phoneNumber,
        username,
        id,
      );

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id,
          email,
          name,
          username,
          password,
          phoneNumber,
          countryCode,
        },
      });
    });
  });

  describe('update user data', () => {
    const mockUser: User = {
      id: 'dafsf-dfsafasf-asdfasdf',
      name: 'testing',
      email: 'testing@gmail.com',
      username: 'testing',
      password: '1sgsfgdsgsdertse',
      phoneNumber: '8281231221',
      countryCode: '+62',
      emailVerifiedAt: new Date('2021-06-19T18:30:00.000Z'),
      otp: null,
      tokenReset: null,
      createdAt: new Date('2021-06-19T18:00:00.000Z'),
      updatedAt: new Date('2021-06-19T18:00:00.000Z'),
    };
    it('should update activate account user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const { name, email, id, username, password, phoneNumber, countryCode } =
        mockUser;

      const curUser = await userRepository.create(
        email,
        name,
        password,
        countryCode,
        phoneNumber,
        username,
        id,
      );

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);

      const result: User = await userRepository.updateActivateAccountUser(
        mockUser.id,
      );

      expect(result.otp).toEqual(null);
      expect(result.emailVerifiedAt).toBeTruthy();
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          otp: null,
          emailVerifiedAt: new Date('2021-06-19T18:30:00.000Z'),
        },
      });
    });

    // it('should update reset token user', async () => {
    //   jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

    //   const { name, email, id, username, password, phoneNumber, countryCode } =
    //     mockUser;

    //   const curUser = await userRepository.create(
    //     email,
    //     name,
    //     password,
    //     countryCode,
    //     phoneNumber,
    //     username,
    //     id,
    //   );

    //   jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);

    //   const result: User = await userRepository.updateResetToken(
    //     mockUser.id,
    //     'asdasda-asdasda-sdasdadsasd',
    //   );

    //   expect(result.tokenReset).toBeTruthy();
    //   expect(prismaService.user.update).toHaveBeenCalledWith({
    //     where: { id: mockUser.id },
    //     data: { tokenReset: 'asdasda-asdasda-sdasdadsasd' },
    //   });
    // });
  });
});
