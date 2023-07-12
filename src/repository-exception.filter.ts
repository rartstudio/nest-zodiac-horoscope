import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { RepositoryNotFoundException } from './repository-not-found-exception';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './i18n/generated/i18n.generated';

@Catch(RepositoryNotFoundException)
export class RepositoryExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}
  catch(exception: RepositoryNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const lang: string = ctx.getRequest().i18nLang;

    if (status == 404) {
      response.status(status).json({
        status: false,
        error: {
          code: status,
          message: this.i18n.translate('http.notFound', { lang }),
        },
      });
    }
  }
}
