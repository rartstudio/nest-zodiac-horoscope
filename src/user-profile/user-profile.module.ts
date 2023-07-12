import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HoroscopeModule } from 'src/horoscope/horoscope.module';
import { ZodiacModule } from 'src/zodiac/zodiac.module';
import { StorageModule } from '../storage/storage.module';
import { UserProfileRepository } from './user-profile.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    HoroscopeModule,
    ZodiacModule,
    StorageModule,
    UserModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, UserProfileRepository],
})
export class UserProfileModule {}
