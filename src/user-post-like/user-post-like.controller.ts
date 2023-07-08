import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserVerifiedGuard } from '../user/user-verified.guard';
import { UserExistGuard } from '../user/user-exist.guard';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
} from '../response.interface';
import { PostLikeService } from '../post-like/post-like.service';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { PostService } from '../post/post.service';
import { PostSelected } from '../post/post-select.type';
import { UserLimitResponse } from '../user/response/user-limit-response.dto';
import { PostLikeResponse } from '../post-like/response/post-like.response';
import { PostResponse } from '../post/response/post-response.dto';
import { PostLikeExistGuard } from '../post-like/post-like-exist.guard';
import { PostExistGuard } from '../post/post-exist.guard';
import { PostCommentResponse } from '../post-comment/response/post-comment.response';
import { UserPostLikeUniqueGuard } from './user-post-like-unique.guard';

@Controller({
  path: 'users/posts',
  version: '1',
})
@ApiTags('users post')
@UseGuards(JwtAuthGuard, UserVerifiedGuard, UserExistGuard, PostExistGuard)
@ApiForbiddenResponse({
  schema: {
    example: {
      status: false,
      error: {
        code: HttpStatus.FORBIDDEN,
        message: 'Error Message',
      },
    } as BasicResponseError,
  },
})
@ApiUnauthorizedResponse({
  schema: {
    example: {
      status: false,
      error: {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Error Message',
      },
    } as BasicResponseError,
  },
})
@ApiNotFoundResponse({
  schema: {
    example: {
      status: false,
      error: {
        code: HttpStatus.NOT_FOUND,
        message: 'Error Message',
      },
    } as BasicResponseError,
  },
})
@ApiBearerAuth()
@ApiHeader({
  name: 'x-lang',
  schema: {
    example: ['id', 'en'],
  },
})
export class UserPostLikeController {
  constructor(
    private readonly i18nService: I18nService,
    private readonly postLikeService: PostLikeService,
    private readonly postService: PostService,
  ) {}

  @Post(':postId/like')
  @UseGuards(UserPostLikeUniqueGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          id: 'dasdad-ada-asdasd',
          content: 'adadasdas',
          user: {
            id: 'asdasd-asdasd-asdas',
            name: 'asdasasdas',
          } as UserLimitResponse,
          likes: [
            {
              id: 2,
              user: {
                id: 'asda-asd-adasd',
                name: 'aasdasd',
              },
            },
          ] as PostLikeResponse[],
          comments: [
            {
              id: 'asda-dsad-dsasd',
              comment: 'adsada',
              user: {
                id: 'asda-asd-adasd',
                name: 'aasdasd',
              },
            },
          ] as PostCommentResponse[],
        } as PostResponse,
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async like(
    @UserDecorator() userJWT: UserJWTPayload,
    @Param('postId') postId: string,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    await this.postLikeService.create(postId, userJWT.id);

    const post: PostSelected = await this.postService.findOne(postId);

    const user: UserLimitResponse = new UserLimitResponse({
      id: post.user.id,
      name: post.user.name,
    });

    const likes: PostLikeResponse[] = post.likes.map((like) => {
      return new PostLikeResponse({
        id: like.id,
        user: new UserLimitResponse({
          id: like.user.id,
          name: like.user.name,
        }),
      });
    });

    const comments: PostCommentResponse[] = post.comments.map((comment) => {
      return new PostCommentResponse({
        id: comment.id,
        comment: comment.content,
        user: new UserLimitResponse({
          id: comment.user.id,
          name: comment.user.name,
        }),
      });
    });

    const responseDto: PostResponse = new PostResponse({
      id: post.id,
      content: post.content,
      user,
      likes,
      comments,
    });

    return {
      data: responseDto,
      status: true,
      message: this.i18nService.translate(
        'response.user.route.postsLike.success',
        {
          lang,
        },
      ),
    };
  }

  @Delete(':postId/dislike')
  @UseGuards(PostLikeExistGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          id: 'dasdad-ada-asdasd',
          content: 'adadasdas',
          user: {
            id: 'asdasd-asdasd-asdas',
            name: 'asdasasdas',
          } as UserLimitResponse,
          likes: [
            {
              id: 2,
              user: {
                id: 'asda-asd-adasd',
                name: 'aasdasd',
              },
            },
          ] as PostLikeResponse[],
          comments: [
            {
              id: 'asda-dsad-dsasd',
              comment: 'adsada',
              user: {
                id: 'asda-asd-adasd',
                name: 'aasdasd',
              },
            },
          ] as PostCommentResponse[],
        } as PostResponse,
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async delete(
    @Param('postId') postId: string,
    @UserDecorator() userJWT: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    await this.postLikeService.delete(postId, userJWT.id);

    const post: PostSelected = await this.postService.findOne(postId);

    const user: UserLimitResponse = new UserLimitResponse({
      id: post.user.id,
      name: post.user.name,
    });

    const likes: PostLikeResponse[] = post.likes.map((like) => {
      return new PostLikeResponse({
        id: like.id,
        user: new UserLimitResponse({
          id: like.user.id,
          name: like.user.name,
        }),
      });
    });

    const comments: PostCommentResponse[] = post.comments.map((comment) => {
      return new PostCommentResponse({
        id: comment.id,
        comment: comment.content,
        user: new UserLimitResponse({
          id: comment.user.id,
          name: comment.user.name,
        }),
      });
    });

    const responseDto: PostResponse = new PostResponse({
      id: post.id,
      content: post.content,
      user,
      likes,
      comments,
    });

    return {
      data: responseDto,
      status: true,
      message: this.i18nService.translate(
        'response.user.route.postsDislike.success',
        {
          lang,
        },
      ),
    };
  }
}
