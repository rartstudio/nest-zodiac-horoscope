import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { PostService } from './post.service';
import { PostSelected } from './post-select.type';

@Injectable()
export class PostExistGuard implements CanActivate {
  constructor(
    private postService: PostService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const lang: string = context.switchToHttp().getRequest().i18nLang;
    const post: PostSelected = await this.postService.findOne(
      request.params.postId,
    );
    if (post == null) {
      throw new NotFoundException(
        this.i18nService.translate('response.post.guard.exist', {
          lang,
        }),
      );
    }
    return true;
  }
}
