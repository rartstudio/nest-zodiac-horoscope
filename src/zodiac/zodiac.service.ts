import { Injectable } from '@nestjs/common';
import { Zodiac } from '@prisma/client';

@Injectable()
export class ZodiacService {
  checkZodiac(year: number) {
    const animals = Object.values(Zodiac);
    const startYear = 1900; // Start year of the Chinese zodiac cycle
    const offset = (year - startYear) % animals.length;
    const animalIndex = offset < 0 ? animals.length + offset : offset;

    return animals[animalIndex];
  }
}
