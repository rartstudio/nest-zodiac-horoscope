import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { JwtRefreshAuthGuard } from '../auth/jwt-refresh-auth.guard';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { UserExistGuard } from '../user/user-exist.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPasswordService } from '../user/user-password.service';
import { OtpDto } from './dto/otp.dto';
import { LoginDto } from './dto/login.dto';
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
@UseGuards(JwtAuthGuard, UserExistGuard)
@ApiTags('auth')
@ApiHeader({
  name: 'x-lang',
  schema: {
    example: ['id', 'en'],
    default: 'en',
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
    },
  },
})
@ApiNotFoundResponse({
  schema: {
    example: {
      status: false,
      error: {
        code: HttpStatus.NOT_FOUND,
        message: 'Pengguna tidak terdaftar',
      },
    },
  },
})
export class AuthUserTokenController {
  constructor(
    private userService: UserService,
    private userPasswordService: UserPasswordService,
    private tokenService: TokenService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Get('/refresh-token')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          accessToken: 'some random string',
          refreshToken: 'some random string',
        },
        status: true,
        message: 'Success Message',
      },
    },
  })
  async refreshToken(
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | BasicResponseError> {
    const result: UserSelected | null = await this.userService.findOneById(
      user.id,
    );

    const accessToken = await this.tokenService.generateAccessToken(
      result.id,
      result.name,
      result.emailVerifiedAt,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(
      result.id,
      result.name,
      result.emailVerifiedAt,
    );

    return {
      data: {
        accessToken,
        refreshToken,
      },
      status: true,
      message: this.i18nService.translate(
        'response.auth.route.refreshToken.success',
        {
          lang,
        },
      ),
    };
  }

  @Post('otp')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `Error Message`,
          field: {
            otp: ['Error Message'],
          },
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          accessToken: 'some random string',
          refreshToken: 'some random string',
          isEmailVerified: true,
        },
        status: true,
        message: 'Success Message',
      },
    },
  })
  async otp(
    @Body() otpDto: OtpDto,
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | BasicResponseError> {
    // extract out dto
    const { otp } = otpDto;

    // check current user record
    const userEmail: UserSelected = await this.userService.findOneById(user.id);

    if (userEmail && userEmail.otp == otp) {
      const result = await this.userService.updateActivateAccountUser(
        userEmail.id,
      );

      const accessToken = await this.tokenService.generateAccessToken(
        result.id,
        result.name,
        result.emailVerifiedAt,
      );
      const refreshToken = await this.tokenService.generateRefreshToken(
        result.id,
        result.name,
        result.emailVerifiedAt,
      );

      return {
        data: {
          accessToken,
          refreshToken,
          isEmailVerified: result.emailVerifiedAt ? true : false,
        },
        status: true,
        message: this.i18nService.translate('response.auth.route.otp.success', {
          lang,
        }),
      };
    } else {
      throw new UnprocessableEntityException({
        otp: this.i18nService.translate('response.auth.route.otp.error.otp', {
          lang,
        }),
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `Error Message`,
          field: {
            username: ['Error Message'],
          },
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          accessToken: 'some random string',
          refreshToken: 'some random string',
        },
        status: true,
        message: 'Success Message',
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | BasicResponseError> {
    // extract out object from dto
    const { username, password } = loginDto;

    // get user
    const user: UserSelected = await this.userService.findOneByUsername(
      username,
    );

    if (user) {
      // check user password
      const validatedPassword = await this.userPasswordService.verify(
        user.password,
        password,
      );

      if (!validatedPassword) {
        throw new UnprocessableEntityException({
          username: [
            this.i18nService.translate('response.auth.route.otp.error.otp', {
              lang,
            }),
          ],
        });
      }

      // generate and return token
      const accessToken = await this.tokenService.generateAccessToken(
        user.id,
        user.name,
        user.emailVerifiedAt,
      );
      const refreshToken = await this.tokenService.generateRefreshToken(
        user.id,
        user.name,
        user.emailVerifiedAt,
      );

      return {
        data: {
          accessToken,
          refreshToken,
        },
        status: true,
        message: this.i18nService.translate(
          'response.auth.route.login.success',
          {
            lang,
          },
        ),
      };
    } else {
      throw new UnprocessableEntityException({
        username: [
          this.i18nService.translate('response.auth.route.otp.error.otp', {
            lang,
          }),
        ],
      });
    }
  }
}
