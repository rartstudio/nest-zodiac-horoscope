import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, UserProfile, Horoscope, Zodiac } from '@prisma/client';
import { UserProfileRepository } from './user-profile.repository';

describe('UserProfileRepository', () => {
  let userProfileRepository: UserProfileRepository;
  let prismaService: PrismaService;

  const mockUser: UserProfile = {
    id: 'dafsf-dfsafasf-asdfasdf',
    name: 'testing',
    gender: 'MALE',
    birthdate: new Date(),
    height: 189,
    weight: 68,
    profileUrl: 'image url',
    horoscope: Horoscope.VIRGO,
    zodiac: Zodiac.RAT,
    userId: 'asdasda-asdasd-adasda',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserProfileRepository,
        {
          provide: PrismaService,
          useValue: {
            userProfile: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userProfileRepository = moduleRef.get<UserProfileRepository>(
      UserProfileRepository,
    );
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find one by id', () => {
    it('should return a user by ID', async () => {
      jest
        .spyOn(prismaService.userProfile, 'findFirst')
        .mockResolvedValue(mockUser);

      const result = await userProfileRepository.get(mockUser.userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(prismaService.userProfile, 'findFirst')
        .mockResolvedValue(null);

      const result = await userProfileRepository.get(mockUser.id);

      expect(result).toEqual(null);
    });
  });
  describe('create user', () => {
    it('should create user', async () => {
      jest
        .spyOn(prismaService.userProfile, 'create')
        .mockResolvedValue(mockUser);

      const {
        profileUrl,
        name,
        gender,
        birthdate,
        height,
        weight,
        horoscope,
        zodiac,
        userId,
      } = mockUser;

      const user: Prisma.UserProfileCreateInput = {
        name,
        gender,
        birthdate,
        profileUrl,
        height,
        weight,
        horoscope,
        zodiac,
        user: {
          connect: {
            id: userId,
          },
        },
      };

      const result = await userProfileRepository.create(user);

      expect(result).toEqual(mockUser);
    });
  });
  describe('update user', () => {
    it('should update user horoscope to aries', async () => {
      // update value to aries
      mockUser.horoscope = Horoscope.ARIES;
      jest
        .spyOn(prismaService.userProfile, 'update')
        .mockResolvedValue(mockUser);

      const {
        profileUrl,
        name,
        gender,
        birthdate,
        height,
        weight,
        zodiac,
        userId,
      } = mockUser;

      const user: Prisma.UserProfileUpdateInput = {
        name,
        gender,
        birthdate,
        profileUrl,
        height,
        weight,
        horoscope: Horoscope.ARIES,
        zodiac,
        user: {
          connect: {
            id: userId,
          },
        },
      };

      const result = await userProfileRepository.update(userId, user);

      expect(result.horoscope).toEqual(Horoscope.ARIES);
    });
  });
});
