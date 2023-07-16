import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { UserPasswordService } from '../user/user-password.service';
import { LoginDto } from './dto/login.dto';
import { UserSelected } from 'src/user/user.type';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
} from 'src/response.interface';
import { RegisterDto } from './dto/register.dto';

@Controller()
@ApiTags('auth')
@ApiHeader({
  name: 'x-lang',
  schema: {
    example: ['id', 'en'],
    default: 'en',
  },
})
export class AuthUserTokenController {
  constructor(
    private userService: UserService,
    private userPasswordService: UserPasswordService,
    private tokenService: TokenService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

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
            email: ['Error Message'],
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
    const { email, password } = loginDto;

    // get user
    const user: UserSelected = await this.userService.findOneByEmail(email);

    if (user) {
      // check user password
      const validatedPassword = await this.userPasswordService.verify(
        user.password,
        password,
      );

      if (!validatedPassword) {
        throw new UnprocessableEntityException({
          email: [
            this.i18nService.translate(
              'response.auth.route.login.error.email',
              {
                lang,
              },
            ),
          ],
        });
      }

      // generate and return token
      const accessToken = await this.tokenService.generateAccessToken(user.id);
      const refreshToken = await this.tokenService.generateRefreshToken(
        user.id,
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
        email: [
          this.i18nService.translate('response.auth.route.login.error.email', {
            lang,
          }),
        ],
      });
    }
  }

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
    const { email, password, username } = registerDto;

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
      password,
      username,
    );

    // generate and return token
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return {
      data: {
        accessToken,
        refreshToken,
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
}
