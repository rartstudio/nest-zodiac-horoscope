import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class UserPasswordService {
  async verify(hash: string, plain: string): Promise<boolean> {
    return await argon.verify(hash, plain);
  }

  async hash(text: string): Promise<string> {
    return await argon.hash(text);
  }
}
