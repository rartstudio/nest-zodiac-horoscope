import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { PostService } from '../post/post.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLimitResponse } from '../user/response/user-limit-response.dto';
import { PostResponse } from '../post/response/post-response.dto';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
} from '../response.interface';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { PostSelected } from '../post/post-select.type';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserVerifiedGuard } from '../user/user-verified.guard';
import { UserExistGuard } from '../user/user-exist.guard';
import { PostLikeResponse } from '../post-like/response/post-like.response';
import { PostCommentResponse } from '../post-comment/response/post-comment.response';

@Controller({
  path: 'users/posts',
  version: '1',
})
@ApiTags('users post')
@UseGuards(JwtAuthGuard, UserVerifiedGuard, UserExistGuard)
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
export class UserPostController {
  constructor(
    private readonly postService: PostService,
    private readonly i18nService: I18nService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: [
          {
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
          },
        ] as PostResponse[],
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async posts(
    @I18nLang() lang: string,
    @UserDecorator() userJWT: UserJWTPayload,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    const posts: PostSelected[] = await this.postService.findOneByUserId(
      userJWT.id,
    );

    const responseDto: PostResponse[] = posts.map((post: PostSelected) => {
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

      return new PostResponse({
        id: post.id,
        content: post.content,
        user,
        likes,
        comments,
      });
    });

    return {
      data: responseDto,
      status: true,
      message: this.i18nService.translate(
        'response.user.route.posts.success.get',
        {
          lang,
        },
      ),
    };
  }
}
