import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { PostCommentService } from '../post-comment/post-comment.service';

@Injectable()
export class UserPostCommentExistGuard implements CanActivate {
  constructor(
    private postCommentService: PostCommentService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const lang: string = context.switchToHttp().getRequest().i18nLang;
    const commentId = request.params.commentId;
    const userId = request.user.id;
    const postId = request.params.postId;
    const comment =
      await this.postCommentService.findOneByCommentIdAndPostIdAndUserId(
        commentId,
        postId,
        userId,
      );
    if (comment == null) {
      throw new NotFoundException(
        this.i18nService.translate('response.user.guard.userPostCommentExist', {
          lang,
        }),
      );
    }
    return true;
  }
}
