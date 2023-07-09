import { Injectable } from '@nestjs/common';
import { Horoscope } from '@prisma/client';

@Injectable()
export class HoroscopeService {
  checkHoroscope(birthdate: Date): Horoscope {
    const month = birthdate.getMonth() + 1; // January is month 0, so we add 1
    const day = birthdate.getDate();

    switch (month) {
      case 1: // January
        return day < 20 ? Horoscope.CAPRICORN : Horoscope.AQUARIUS;
      case 2: // February
        return day < 19 ? Horoscope.AQUARIUS : Horoscope.PISCES;
      case 3: // March
        return day < 21 ? Horoscope.PISCES : Horoscope.ARIES;
      case 4: // April
        return day < 20 ? Horoscope.ARIES : Horoscope.TAURUS;
      case 5: // May
        return day < 21 ? Horoscope.TAURUS : Horoscope.GEMINI;
      case 6: // June
        return day < 21 ? Horoscope.GEMINI : Horoscope.CANCER;
      case 7: // July
        return day < 23 ? Horoscope.CANCER : Horoscope.LEO;
      case 8: // August
        return day < 23 ? Horoscope.LEO : Horoscope.VIRGO;
      case 9: // September
        return day < 23 ? Horoscope.VIRGO : Horoscope.LIBRA;
      case 10: // October
        return day < 23 ? Horoscope.LIBRA : Horoscope.SCORPIO;
      case 11: // November
        return day < 22 ? Horoscope.SCORPIO : Horoscope.SAGITARIUS;
      case 12: // December
        return day < 22 ? Horoscope.SAGITARIUS : Horoscope.CAPRICORN;
    }
  }
}
