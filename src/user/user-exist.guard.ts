import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserSelected } from './user.type';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class UserExistGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const lang: string = context.switchToHttp().getRequest().i18nLang;
    const user: UserSelected = await this.userService.findOneById(
      request.user.id,
    );
    if (user == null) {
      throw new NotFoundException(
        this.i18nService.translate('response.user.guard.exist', {
          lang,
        }),
      );
    }
    return true;
  }
}
