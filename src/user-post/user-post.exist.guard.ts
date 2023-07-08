import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { PostService } from '../post/post.service';
import { PostSelected } from '../post/post-select.type';

@Injectable()
export class UserPostExistGuard implements CanActivate {
  constructor(
    private postService: PostService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const lang: string = context.switchToHttp().getRequest().i18nLang;
    const userId = request.user.id;
    const postId = request.params.postId;
    const post: PostSelected = await this.postService.findOneByPostIdAndUserId(
      postId,
      userId,
    );
    if (post == null) {
      throw new NotFoundException(
        this.i18nService.translate('response.user.guard.userPostExist', {
          lang,
        }),
      );
    }
    return true;
  }
}
