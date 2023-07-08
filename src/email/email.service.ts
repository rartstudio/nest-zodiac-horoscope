import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmailOtp(
    email: string,
    name: string,
    subject: string,
    template: string,
    otp: string,
  ) {
    return await this.sendEmail(email, subject, template, {
      otp,
      name,
      logoUrl: `${this.configService.get(
        'APP_URL',
      )}/public/images/logo-whispr.png`,
    });
  }

  async sendEmailResetPassword(
    email: string,
    name: string,
    subject: string,
    template: string,
    resetLink: string,
  ) {
    return await this.sendEmail(email, subject, template, {
      resetLink,
      name,
      logoUrl: `${this.configService.get(
        'APP_URL',
      )}/public/images/logo-whispr.png`,
    });
  }

  async sendEmail(email: string, subject: string, template: string, data: any) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        ...data,
      },
    });
  }
}
