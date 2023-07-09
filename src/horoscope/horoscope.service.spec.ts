import { Test, TestingModule } from '@nestjs/testing';
import { HoroscopeService } from './horoscope.service';

describe('HoroscopeService', () => {
  let service: HoroscopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoroscopeService],
    }).compile();

    service = module.get<HoroscopeService>(HoroscopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
