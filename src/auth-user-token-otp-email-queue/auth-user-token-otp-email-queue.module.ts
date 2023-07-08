import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { OtpModule } from '../otp/otp.module';
import { EmailModule } from '../email/email.module';
import { BullModule } from '@nestjs/bull';
import { AuthUserTokenOtpEmailQueueController } from './auth-user-token-otp-email-queue.controller';
import { AuthUserConsumerService } from './auth-user.consumer.service';
import { AuthUserProducerService } from './auth-user.producer.service';

@Module({
  imports: [
    UserModule,
    TokenModule,
    OtpModule,
    EmailModule,
    BullModule.registerQueue({
      name: 'send-email-auth-queue',
    }),
  ],
  controllers: [AuthUserTokenOtpEmailQueueController],
  providers: [AuthUserConsumerService, AuthUserProducerService],
})
export class AuthUserTokenOtpEmailQueueModule {}
