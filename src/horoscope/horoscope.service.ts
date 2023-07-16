import { Injectable } from '@nestjs/common';
import { Horoscope } from '@prisma/client';

@Injectable()
export class HoroscopeService {
  checkHoroscope(birthdate: string): Horoscope {
    const [year, month, day] = birthdate.split('-'); //yyyy-mm-dd

    // JavaScript months are zero-based (0-11), so subtract 1 from the month value
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    switch (date.getMonth() + 1) {
      case 1: // January
        return date.getDate() < 20 ? Horoscope.CAPRICORN : Horoscope.AQUARIUS;
      case 2: // February
        return date.getDate() < 19 ? Horoscope.AQUARIUS : Horoscope.PISCES;
      case 3: // March
        return date.getDate() < 21 ? Horoscope.PISCES : Horoscope.ARIES;
      case 4: // April
        return date.getDate() < 20 ? Horoscope.ARIES : Horoscope.TAURUS;
      case 5: // May
        return date.getDate() < 21 ? Horoscope.TAURUS : Horoscope.GEMINI;
      case 6: // June
        return date.getDate() < 21 ? Horoscope.GEMINI : Horoscope.CANCER;
      case 7: // July
        return date.getDate() < 23 ? Horoscope.CANCER : Horoscope.LEO;
      case 8: // August
        return date.getDate() < 23 ? Horoscope.LEO : Horoscope.VIRGO;
      case 9: // September
        return date.getDate() < 23 ? Horoscope.VIRGO : Horoscope.LIBRA;
      case 10: // October
        return date.getDate() < 23 ? Horoscope.LIBRA : Horoscope.SCORPIO;
      case 11: // November
        return date.getDate() < 22 ? Horoscope.SCORPIO : Horoscope.SAGITARIUS;
      case 12: // December
        return date.getDate() < 22 ? Horoscope.SAGITARIUS : Horoscope.CAPRICORN;
    }
  }
}
