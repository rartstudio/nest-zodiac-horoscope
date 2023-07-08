import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OtpService } from '../otp/otp.service';
import { UserProducerService } from './user.producer.service';
import { UserVerifiedGuard } from '../user/user-verified.guard';
import { UserExistGuard } from '../user/user-exist.guard';
import { UserService } from '../user/user.service';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { ChangeEmailUserdDto } from '../user/dto/change-email-user.dto';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
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
export class UserEmailOtpQueueController {
  constructor(
    private userService: UserService,
    private otpService: OtpService,
    private userProducerService: UserProducerService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Post('change-email-otp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserExistGuard)
  @ApiConflictResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.CONFLICT,
          message: `Error Message`,
          field: {
            email: ['Error Message'],
          },
        },
      } as FieldResponseError,
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        data: {},
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async changeEmail(
    @Body() changeEmailUserDto: ChangeEmailUserdDto,
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    const { email } = changeEmailUserDto;

    // check email already exist or not
    const result = await this.userService.findOneByEmail(email);
    if (result) {
      throw new ConflictException({
        email: [
          this.i18nService.t('response.user.route.changeEmailOtp.error.email', {
            lang,
          }),
        ],
      });
    }

    // create otp
    const otp = this.otpService.createOtp(6);

    // update value otp
    await this.userService.updateOtp(otp, user.id);

    // send email
    await this.userProducerService.sendEmailUserQueue(user.id, 'change-email');

    return {
      data: {},
      status: true,
      message: this.i18nService.translate(
        'response.user.route.changeEmailOtp',
        {
          lang,
        },
      ),
    };
  }
}
