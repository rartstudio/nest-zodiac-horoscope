import {
  UnprocessableEntityException,
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Patch,
  UseGuards,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { UpdateProfileUserdDto } from './dto/update-profile-user.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateEmailUserDto } from './dto/update-email-user.dto';
import { UserService } from './user.service';
import { UserExistGuard } from './user-exist.guard';
import { UserVerifiedGuard } from './user-verified.guard';
import { UserResponse } from './response/user-response.dto';
import { UserJWTPayload } from './user-jwt.payload';
import { UserPasswordService } from './user-password.service';
import { UserDecorator } from './user.decorator';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
} from '../response.interface';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { UserSelected } from './user-select.type';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Controller({
  version: '1',
  path: 'users',
})
@ApiTags('users')
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
export class UserController {
  constructor(
    private userPasswordService: UserPasswordService,
    private userService: UserService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
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
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async me(
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // get current user data
    const {
      email,
      name,
      countryCode,
      phoneNumber,
      emailVerifiedAt,
      id,
      profileUrl,
    } = await this.userService.findOneById(user.id);

    const responseDto: UserResponse = new UserResponse({
      id,
      email,
      name,
      countryCode,
      phoneNumber,
      isEmailVerified: emailVerifiedAt ? true : false,
      profileUrl,
    });

    return {
      data: responseDto,
      status: true,
      message: this.i18nService.translate('response.user.route.me.success', {
        lang,
      }),
    };
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          email: 'testing@mail.com',
          name: 'testing',
          id: 'asdasdas-asdasd-asdasd',
          countryCode: '+62',
          phoneNumber: '8737123131',
          isEmailVerified: true,
        },
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async updateProfile(
    @UserDecorator() user: UserJWTPayload,
    @Body() updateProfileUserDto: UpdateProfileUserdDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // update user data
    const {
      email,
      emailVerifiedAt,
      name,
      id,
      countryCode,
      phoneNumber,
      profileUrl,
    }: UserSelected = await this.userService.updateProfile(
      user.id,
      updateProfileUserDto.name,
      updateProfileUserDto.phoneNumber,
      updateProfileUserDto.countryCode,
    );

    // returned response
    const responseUser: UserResponse = new UserResponse({
      email,
      name,
      id,
      countryCode,
      phoneNumber,
      isEmailVerified: emailVerifiedAt ? true : false,
      profileUrl,
    });

    return {
      data: responseUser,
      status: true,
      message: this.i18nService.translate(
        'response.user.route.profile.success',
        {
          lang,
        },
      ),
    };
  }

  @Patch('password')
  @HttpCode(204)
  @ApiUnprocessableEntityResponse({
    schema: {
      example: {
        status: false,
        error: {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `Error Message`,
          field: {
            currentPassword: ['Error Message'],
            password: ['Error Message'],
            passwordConfirm: ['Error Message'],
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
  async updatePassword(
    @UserDecorator() user: UserJWTPayload,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // extract out dto
    const { currentPassword, password } = updatePasswordUserDto;

    // get current user data
    const currentUser: UserSelected = await this.userService.findOneById(
      user.id,
    );

    // check current user password
    const validatedPassword: boolean = await this.userPasswordService.verify(
      currentUser.password,
      currentPassword,
    );
    if (!validatedPassword) {
      throw new UnprocessableEntityException({
        currentPassword: [
          this.i18nService.translate(
            'response.user.route.password.error.currentPassword',
            {
              lang,
            },
          ),
        ],
      });
    }

    // update password
    await this.userService.updatePassword(currentUser.email, password);

    return {
      data: {},
      status: true,
      message: this.i18nService.translate(
        'response.user.route.password.success',
        {
          lang,
        },
      ),
    };
  }

  @Patch('email')
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
  @HttpCode(204)
  async updateEmail(
    @UserDecorator() user: UserJWTPayload,
    @Body() updateEmailUserDto: UpdateEmailUserDto,
    @I18nLang() lang: string,
  ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    // extract out entity
    const { email, otp } = updateEmailUserDto;

    // check email already exist or not
    const userExist = await this.userService.findOneByEmail(email);
    if (userExist) {
      throw new ConflictException({
        email: [
          this.i18nService.translate('response.user.route.email.error.email', {
            lang,
          }),
        ],
      });
    }

    // get current user data
    const currentUser: UserSelected = await this.userService.findOneById(
      user.id,
    );

    // check otp same or not
    if (currentUser.otp !== otp) {
      throw new UnprocessableEntityException({
        otp: [
          this.i18nService.translate('response.user.route.email.error.otp', {
            lang,
          }),
        ],
      });
    }

    await this.userService.updateEmail(currentUser.id, email);

    return {
      data: {},
      status: true,
      message: this.i18nService.translate('response.user.route.email.success', {
        lang,
      }),
    };
  }
}
