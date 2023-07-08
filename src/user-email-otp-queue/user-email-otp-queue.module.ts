import { Module } from '@nestjs/common';
import { UserConsumerService } from './user.consumer.service';
import { UserProducerService } from './user.producer.service';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { BullModule } from '@nestjs/bull';
import { UserEmailOtpQueueController } from './user-email-otp-queue.controller';

@Module({
  imports: [
    EmailModule,
    UserModule,
    OtpModule,
    BullModule.registerQueue({
      name: 'send-email-user-queue',
    }),
  ],
  providers: [UserConsumerService, UserProducerService],
  controllers: [UserEmailOtpQueueController],
})
export class UserEmailOtpQueueModule {}
