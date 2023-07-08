import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserSelected } from 'src/user/user-select.type';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import {
  BasicResponseError,
  BasicResponseSuccess,
} from 'src/response.interface';

@Controller({
  version: '1',
  path: 'auth',
})
@ApiTags('auth')
@ApiHeader({
  name: 'x-lang',
  schema: {
    example: ['id', 'en'],
    default: 'en',
  },
})
export class AuthUserController {
  constructor(
    private userService: UserService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Post('verify-reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.BAD_REQUEST,
          message: 'Error Message',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        data: {},
        status: true,
        message: `Success Message`,
      },
    },
  })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | BasicResponseError> {
    const { userId, token } = verifyOtpDto;
    // check user id
    const user: UserSelected | null = await this.userService.findOneById(
      userId,
    );
    if (user != null && user.tokenReset === token) {
      return {
        data: {},
        status: true,
        message: this.i18nService.translate(
          'response.auth.route.verifyResetPassword.success',
          {
            lang,
          },
        ),
      };
    } else {
      throw new BadRequestException(
        this.i18nService.translate(
          'response.auth.route.verifyResetPassword.error.global',
          {
            lang,
          },
        ),
      );
    }
  }

  @Post('reset-password/:id/:token')
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'token', type: String })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.BAD_REQUEST,
          message: 'Error Message',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        data: {},
        status: true,
        message: 'Success Message',
      },
    },
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('id') id: string,
    @Param('token') token: string,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | BasicResponseError> {
    // check user id
    const user: UserSelected | null = await this.userService.findOneById(id);
    if (user != null && user.tokenReset === token) {
      // update reset token
      await this.userService.updateResetToken(user.email, null);

      // extract out dto
      const { password } = resetPasswordDto;

      // update password
      await this.userService.updatePassword(user.email, password);

      return {
        data: {},
        status: true,
        message: this.i18nService.translate(
          'response.auth.route.resetPassword.success',
          {
            lang,
          },
        ),
      };
    } else {
      throw new BadRequestException(
        this.i18nService.translate(
          'response.auth.route.verifyResetPassword.error.global',
          {
            lang,
          },
        ),
      );
    }
  }
}
