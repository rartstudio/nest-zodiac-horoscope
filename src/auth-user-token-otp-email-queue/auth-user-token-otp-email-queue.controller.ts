import {
  Body,
  ConflictException,
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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserExistGuard } from '../user/user-exist.guard';
import { UserDecorator } from '../user/user.decorator';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokenService } from '../token/token.service';
import { OtpService } from '../otp/otp.service';
import { AuthUserProducerService } from './auth-user.producer.service';
import { UserSelected } from 'src/user/user-select.type';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
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
  },
})
export class AuthUserTokenOtpEmailQueueController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private otpService: OtpService,
    private authUserProducerService: AuthUserProducerService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiConflictResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.CONFLICT,
          message: `Error Message`,
          field: {
            username: [`Error Message`],
            email: ['Error Message'],
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        data: {
          accessToken: 'some random string',
          refreshToken: 'some random string',
          emailVerified: true,
        },
        status: true,
        message: 'Success Message',
      },
    },
  })
  async register(
    @Body() registerDto: RegisterDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // extract out object from dto
    const { email, name, password, countryCode, phoneNumber, username } =
      registerDto;

    // check username already exists
    const userUserName = await this.userService.findOneByUsername(username);
    if (userUserName) {
      throw new ConflictException({
        username: [
          this.i18nService.translate(
            'response.auth.route.register.error.username',
            {
              lang,
            },
          ),
        ],
      });
    }

    // check email already exists
    const userEmail = await this.userService.findOneByEmail(email);
    if (userEmail) {
      throw new ConflictException({
        email: [
          this.i18nService.translate(
            'response.auth.route.register.error.email',
            {
              lang,
            },
          ),
        ],
      });
    }

    // register user
    const user: UserSelected = await this.userService.createUser(
      email,
      name,
      password,
      countryCode,
      phoneNumber,
      username,
    );

    // create otp
    const otp: string = this.otpService.createOtp(6);

    //update otp user
    await this.userService.updateOtp(otp, user.id);

    // send email activate account
    await this.authUserProducerService.sendEmailUserQueue(user.id, 'otp');

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
        emailVerified: user.emailVerifiedAt ? true : false,
      },
      status: true,
      message: this.i18nService.translate(
        'response.auth.route.register.success',
        {
          lang,
        },
      ),
    };
  }

  @Get('otp')
  @UseGuards(JwtAuthGuard, UserExistGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: '',
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
          message: 'Success Message',
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
  async getOtp(
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // create otp
    const otp: string = this.otpService.createOtp(6);

    //update otp user
    await this.userService.updateOtp(otp, user.id);

    // send email activate account
    await this.authUserProducerService.sendEmailUserQueue(user.id, 'otp');

    return {
      data: {},
      status: true,
      message: this.i18nService.translate(
        'response.auth.route.otp.success.get',
        {
          lang,
        },
      ),
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `Error Message`,
          field: {
            email: ['Error Message'],
          },
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
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // check email exist or not
    const user: UserSelected | null = await this.userService.findOneByEmail(
      forgotPasswordDto.email,
    );
    if (user == null) {
      throw new UnprocessableEntityException({
        email: [
          this.i18nService.translate(
            'response.auth.route.forgotPassword.error.email',
            {
              lang,
            },
          ),
        ],
      });
    }

    // generate token reset
    const tokenReset = this.tokenService.generateTokenReset();

    // update reset token value to user
    await this.userService.updateResetToken(user.email, tokenReset);

    // send email activate account
    await this.authUserProducerService.sendEmailUserQueue(
      user.id,
      'reset-password',
    );

    return {
      data: {},
      status: true,
      message: this.i18nService.translate(
        'response.auth.route.forgotPassword.success',
        {
          lang,
        },
      ),
    };
  }
}
