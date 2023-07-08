import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Processor('send-email-auth-queue')
export class AuthUserConsumerService {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  @Process('send-email-otp')
  async processSendEmailOtp(job: Job) {
    const { email, name, otp } = await this.userService.findOneById(
      job.data.id,
    );

    await this.emailService.sendEmailOtp(
      email,
      name,
      'Account Verification Whispr',
      './verified-account',
      otp,
    );
    return 'success send email otp';
  }

  @Process('send-email-reset-password')
  async processSendEmailResetPassword(job: Job) {
    const { email, name, id, tokenReset } = await this.userService.findOneById(
      job.data.id,
    );

    await this.emailService.sendEmailResetPassword(
      email,
      name,
      'Reset Password Link Account',
      './reset-password',
      `${this.configService.get(
        'CMS_URL',
      )}/recover-password/${id}/${tokenReset}`,
    );
    return 'success send email reset password';
  }
}
