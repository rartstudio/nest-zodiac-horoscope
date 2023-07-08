import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { PostLikeService } from './post-like.service';

@Injectable()
export class PostLikeExistGuard implements CanActivate {
  constructor(
    private postLikeService: PostLikeService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const lang: string = context.switchToHttp().getRequest().i18nLang;
    const userId = request.user.id;
    const postId = request.params.postId;
    const post = await this.postLikeService.findOne(postId, userId);
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
