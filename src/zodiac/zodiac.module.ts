import { Module } from '@nestjs/common';
import { ZodiacService } from './zodiac.service';

@Module({
  providers: [ZodiacService],
  exports: [ZodiacService],
})
export class ZodiacModule {}
