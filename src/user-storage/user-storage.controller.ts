import {
  Controller,
  Post,
  UseInterceptors,
  HttpCode,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserVerifiedGuard } from '../user/user-verified.guard';
import { UserExistGuard } from '../user/user-exist.guard';
import { FileUpload } from './TFile';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { UserResponse } from '../user/response/user-response.dto';
import {
  BasicResponseError,
  BasicResponseSuccess,
} from '../response.interface';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Controller({
  version: '1',
  path: 'users',
})
@ApiHeader({
  name: 'x-lang',
  schema: {
    example: ['id', 'en'],
    default: 'en',
  },
})
@ApiTags('users')
@ApiBearerAuth()
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
export class UserStorageController {
  constructor(
    private userService: UserService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Post('/attachment')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          id: 'asdasdas-asdasd-asdasd',
          email: 'an email',
          name: ' a name',
          countryCode: '+62',
          phoneNumber: '8189809987',
          isEmailVerified: true,
          profileUrl: 'link https',
        } as UserResponse,
        status: true,
        message: `Success Message`,
      } as BasicResponseSuccess,
    },
  })
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: RegExp(/.(jpg|jpeg|png)$/) }),
        ],
      }),
    )
    file: FileUpload,
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | BasicResponseError> {
    const result = await this.userService.updateProfileImage(
      user.id,
      file.location,
    );

    const userResponse: UserResponse = new UserResponse({
      id: result.id,
      email: result.email,
      name: result.name,
      countryCode: result.countryCode,
      phoneNumber: result.phoneNumber,
      isEmailVerified: result.emailVerifiedAt ? true : false,
      profileUrl: result.profileUrl,
    });

    return {
      data: userResponse,
      status: true,
      message: this.i18nService.translate(
        'response.user.route.attachment.success',
        {
          lang,
        },
      ),
    };
  }
}
