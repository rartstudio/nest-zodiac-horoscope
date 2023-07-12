import { HttpException, HttpStatus } from '@nestjs/common';

export class RepositoryNotFoundException extends HttpException {
  constructor(message: string, httpCode: number) {
    super(message, httpCode);
  }
}
