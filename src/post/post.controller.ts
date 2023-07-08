import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
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
import { I18nLang, I18nService } from 'nestjs-i18n';
import { PostService } from './post.service';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { PostResponse } from './response/post-response.dto';
import { PostSelected } from './post-select.type';
import { UserLimitResponse } from '../user/response/user-limit-response.dto';
import { PostDto } from './dto/post.dto';
import { PostLikeResponse } from '../post-like/response/post-like.response';
import { PostCommentResponse } from '../post-comment/response/post-comment.response';
import { I18nTranslations } from '../i18n/generated/i18n.generated';

@Controller({
  path: 'posts',
  version: '1',
})
@ApiTags('posts')
@UseGuards(JwtAuthGuard, UserVerifiedGuard)
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
export class PostController {
  constructor(
    private postService: PostService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Get('/')
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
  async getAll(
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    const posts: PostSelected[] = await this.postService.findAll();

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
        'response.posts.route.all.success.get',
        {
          lang,
        },
      ),
    };
  }

  @Get('/:postId')
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
  async getDetail(
    @Param('postId') postId: string,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
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
        'response.posts.route.detail.success.get',
        {
          lang,
        },
      ),
    };
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    schema: {
      example: {} as BasicResponseSuccess,
    },
  })
  async create(
    @Body() postDto: PostDto,
    @UserDecorator() userJWT: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    const post: PostSelected = await this.postService.create(
      userJWT.id,
      postDto,
    );

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
        'response.posts.route.all.success.post',
        {
          lang,
        },
      ),
    };
  }
}
