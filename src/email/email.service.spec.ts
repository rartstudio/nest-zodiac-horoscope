import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'http://localhost:3000'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    emailService = moduleRef.get<EmailService>(EmailService);
    mailerService = moduleRef.get<MailerService>(MailerService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('sendEmailOtp', () => {
    it('should send email with OTP successfully', async () => {
      const email = 'test@example.com';
      const name = 'John Doe';
      const subject = 'OTP for login';
      const template = 'otp-template';
      const otp = '123456';

      await emailService.sendEmailOtp(email, name, subject, template, otp);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject,
        template,
        context: {
          otp,
          name,
          logoUrl: `${configService.get(
            'APP_URL',
          )}/public/images/logo-whispr.png`,
        },
      });
    });
  });

  describe('sendEmailResetPassword', () => {
    it('should send email with reset link successfully', async () => {
      const email = 'test@example.com';
      const name = 'John Doe';
      const subject = 'Reset your password';
      const template = 'reset-password-template';
      const resetLink = 'http://localhost:3000/reset-password';

      await emailService.sendEmailResetPassword(
        email,
        name,
        subject,
        template,
        resetLink,
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject,
        template,
        context: {
          resetLink,
          name,
          logoUrl: `${configService.get(
            'APP_URL',
          )}/public/images/logo-whispr.png`,
        },
      });
    });
  });
});
