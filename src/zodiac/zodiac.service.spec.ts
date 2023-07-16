import { Test, TestingModule } from '@nestjs/testing';
import { ZodiacService } from './zodiac.service';
import { Zodiac } from '@prisma/client';

describe('ZodiacService', () => {
  let service: ZodiacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZodiacService],
    }).compile();

    service = module.get<ZodiacService>(ZodiacService);
  });

  it('should return RAT', () => {
    const result: Zodiac = service.checkZodiac(1996);
    expect(result).toEqual(Zodiac.RAT);
  });
});
