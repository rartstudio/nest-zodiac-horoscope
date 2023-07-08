import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { PostLikeService } from '../post-like/post-like.service';

@Injectable()
export class UserPostLikeUniqueGuard implements CanActivate {
  constructor(
    private postLikeService: PostLikeService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const lang: string = context.switchToHttp().getRequest().i18nLang;
    const userId = request.user.id;
    const postId = request.params.postId;
    const like = await this.postLikeService.findOne(postId, userId);
    if (like) {
      throw new ConflictException(
        this.i18nService.translate('response.user.guard.userPostLikeUnique', {
          lang,
        }),
      );
    }
    return true;
  }
}
