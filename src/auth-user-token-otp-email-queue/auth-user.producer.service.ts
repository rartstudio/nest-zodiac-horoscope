import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AuthUserProducerService {
  constructor(@InjectQueue('send-email-auth-queue') private queue: Queue) {}

  async sendEmailUserQueue(userId: string, type: string) {
    if (type === 'otp') {
      return await this.queue.add('send-email-otp', { id: userId });
    }

    if (type === 'reset-password') {
      return await this.queue.add('send-email-reset-password', { id: userId });
    }
  }
}
