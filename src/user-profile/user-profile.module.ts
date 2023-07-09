import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HoroscopeModule } from 'src/horoscope/horoscope.module';
import { ZodiacModule } from 'src/zodiac/zodiac.module';

@Module({
  imports: [PrismaModule, HoroscopeModule, ZodiacModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
