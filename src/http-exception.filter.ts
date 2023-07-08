import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './i18n/generated/i18n.generated';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const lang: string = ctx.getRequest().i18nLang;
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message: any = exception.getResponse();

    if (status == 403) {
      response.status(status).json({
        status: false,
        error: {
          code: status,
          message: this.i18n.translate('http.forbidden', { lang }),
        },
      });
    } else if (status == 401) {
      response.status(status).json({
        status: false,
        error: {
          code: status,
          message: this.i18n.translate('http.unauthorized', { lang }),
        },
      });
    } else if (status == 422) {
      response.status(status).json({
        status: false,
        error: {
          code: status,
          message: this.i18n.translate('http.unprocessableContent', { lang }),
          field: message,
        },
      });
    } else if (status == 409) {
      response.status(status).json({
        status: false,
        error: {
          code: status,
          message: this.i18n.translate('http.conflict', { lang }),
          field: message,
        },
      });
    } else {
      response.status(status).json({
        status: false,
        error: {
          code: status,
          message: message.message,
        },
      });
    }
  }
}
