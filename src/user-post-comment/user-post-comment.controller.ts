import {
  Controller,
  UseGuards,
  HttpStatus,
  Post,
  Delete,
  HttpCode,
  Param,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserVerifiedGuard } from '../user/user-verified.guard';
import { UserExistGuard } from '../user/user-exist.guard';
import { PostExistGuard } from '../post/post-exist.guard';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
} from '../response.interface';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { UserDecorator } from '../user/user.decorator';
import { PostService } from '../post/post.service';
import { PostSelected } from '../post/post-select.type';
import { UserLimitResponse } from '../user/response/user-limit-response.dto';
import { PostLikeResponse } from '../post-like/response/post-like.response';
import { PostCommentResponse } from '../post-comment/response/post-comment.response';
import { PostResponse } from '../post/response/post-response.dto';
import { PostCommentService } from '../post-comment/post-comment.service';
import { PostCommentDto } from '../post-comment/dto/post-comment.dto';
import { UserPostCommentExistGuard } from './user-post-comment-exist.guard';

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
export class UserPostCommentController {
  constructor(
    private readonly i18nService: I18nService,
    private readonly postService: PostService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @Post(':postId/comments')
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
  async comment(
    @UserDecorator() userJWT: UserJWTPayload,
    @Param('postId') postId: string,
    @Body() postCommentDto: PostCommentDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    await this.postCommentService.create(postCommentDto, userJWT.id, postId);

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
        'response.user.route.postsComments.success.get',
        {
          lang,
        },
      ),
    };
  }

  @Delete(':postId/comments/:commentId')
  @UseGuards(UserPostCommentExistGuard)
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
    @Param('commentId') commentId: string,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    await this.postCommentService.delete(commentId);

    const post: PostSelected = await this.postService.findOne(commentId);

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

    const responseDto: PostResponse = new PostResponse({
      id: post.id,
      content: post.content,
      user,
      likes,
    });

    return {
      data: responseDto,
      status: true,
      message: this.i18nService.translate(
        'response.user.route.postsCommentsDetail.success.delete',
        {
          lang,
        },
      ),
    };
  }
}
