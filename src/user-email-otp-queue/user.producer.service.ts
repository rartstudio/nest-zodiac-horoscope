import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class UserProducerService {
  constructor(@InjectQueue('send-email-user-queue') private queue: Queue) {}

  async sendEmailUserQueue(userId: string, type: string) {
    if (type === 'change-email') {
      return await this.queue.add('send-email-change-email', { id: userId });
    }
  }
}
