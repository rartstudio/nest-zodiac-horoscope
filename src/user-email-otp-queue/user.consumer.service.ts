import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Processor('send-email-user-queue')
export class UserConsumerService {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  @Process('send-email-change-email')
  async processSendEmailOtp(job: Job) {
    const { email, name, otp } = await this.userService.findOneById(
      job.data.id,
    );

    await this.emailService.sendEmailOtp(
      email,
      name,
      'Change Email Whisper Account',
      './change-email',
      otp,
    );
    console.log('success send email change email');
  }
}
