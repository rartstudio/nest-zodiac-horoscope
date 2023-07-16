import { Test, TestingModule } from '@nestjs/testing';
import { HoroscopeService } from './horoscope.service';
import { Horoscope } from '@prisma/client';

describe('HoroscopeService', () => {
  let service: HoroscopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoroscopeService],
    }).compile();

    service = module.get<HoroscopeService>(HoroscopeService);
  });

  it('should return VIRGO', () => {
    const result: Horoscope = service.checkHoroscope('1996-09-06');
    expect(result).toEqual(Horoscope.VIRGO);
  });
});
