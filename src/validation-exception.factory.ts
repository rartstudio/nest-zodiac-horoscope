import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ValidationExceptionFactory {
  constructor(private readonly i18n: I18nService) {}

  createException(errors: ValidationError[], host: any): any {
    //access directly lang via http adapter instance
    const lang = host.locals.i18nLang;
    const customErrors = errors.map((el: ValidationError) => {
      const constraintsErrorKeys = Object.keys(el.constraints);
      const constraintsErrorMessages = constraintsErrorKeys.map(
        (errorKey: string) => {
          return this.i18n.t(`validation.${el.property}.${errorKey}`, { lang });
        },
      );

      return {
        field: el.property,
        message: constraintsErrorMessages,
      };
    });

    //convert
    const result = {};
    for (let i = 0; i < customErrors.length; i++) {
      result[customErrors[i].field] = customErrors[i].message.map(
        (el: string) => el.charAt(0).toUpperCase() + el.slice(1),
      );
    }

    return new UnprocessableEntityException(result);
  }
}
