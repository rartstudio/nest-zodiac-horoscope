import {
  Body,
  Controller,
  HttpCode,
  Patch,
  UseGuards,
  HttpStatus,
  Get,
  Post,
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
import { UserExistGuard } from '../user/user-exist.guard';
import { UserJWTPayload } from '../user/user-jwt.payload';
import { UserDecorator } from '../user/user.decorator';
import {
  BasicResponseError,
  BasicResponseSuccess,
  FieldResponseError,
} from '../response.interface';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { UserProfileResponse } from './response/user-profile.response';
import { UserProfileService } from './user-profile.service';
import { Horoscope, Zodiac } from '@prisma/client';
import { UserProfileDto } from './dto/user-profile.dto';
import { HoroscopeService } from 'src/horoscope/horoscope.service';
import { ZodiacService } from 'src/zodiac/zodiac.service';
import { UserProfileSelected } from './user-profile.type';

@Controller({
  version: '1',
})
@ApiTags('users')
@UseGuards(JwtAuthGuard, UserExistGuard)
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
export class UserProfileController {
  constructor(
    private userProfileService: UserProfileService,
    private i18nService: I18nService<I18nTranslations>,
    private horoscopeService: HoroscopeService,
    private zodiacService: ZodiacService,
  ) {}

  @Get('getProfile')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          userId: 'asdasdas-asdasd-asdasd',
          name: 'name',
          gender: 'MALE',
          birthDate: new Date(),
          height: 183,
          weight: 39,
          profileUrl: 'path image',
          horoscope: Horoscope.AQUARIUS,
          zodiac: Zodiac.DOG,
        } as UserProfileResponse,
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async getProfile(
    @UserDecorator() user: UserJWTPayload,
    @I18nLang() lang: string,
    // ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
  ) {
    // get current user data
    const {
      userId,
      name,
      gender,
      birthdate,
      height,
      weight,
      profileUrl,
      horoscope,
      zodiac,
    } = await this.userProfileService.get(user.id);

    const responseDto: UserProfileResponse = new UserProfileResponse({
      userId,
      name,
      gender,
      birthDate: birthdate,
      height,
      weight,
      profileUrl,
      horoscope,
      zodiac,
    });

    // return {
    //   data: responseDto,
    //   status: true,
    //   message: this.i18nService.translate('response.user.route.me.success', {
    //     lang,
    //   }),
    // };
  }

  @Post('createProfile')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          userId: 'asdasdas-asdasd-asdasd',
          name: 'name',
          gender: 'MALE',
          birthDate: new Date(),
          height: 183,
          weight: 39,
          profileUrl: 'path image',
          horoscope: Horoscope.AQUARIUS,
          zodiac: Zodiac.DOG,
        } as UserProfileResponse,
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async createProfile(
    @UserDecorator() user: UserJWTPayload,
    @Body() userProfileDto: UserProfileDto,
    @I18nLang() lang: string,
  ) {
  // ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    const { birthDate } = userProfileDto;
    const horoscope: Horoscope = this.horoscopeService.checkHoroscope(
      new Date(birthDate),
    );
    const zodiac: Zodiac = this.zodiacService.checkZodiac(
      parseInt(birthDate.substring(0, 4)),
    );
    const profile: UserProfileSelected = await this.userProfileService.create(
      userProfileDto,
      user.id,
      horoscope,
      zodiac,
    );
    const responseDto: UserProfileResponse = new UserProfileResponse({
      userId: profile.userId,
      name: profile.name,
      gender: profile.gender,
      birthDate: profile.birthdate,
      height: profile.height,
      weight: profile.weight,
      profileUrl: profile.profileUrl,
      horoscope: profile.horoscope,
      zodiac: profile.zodiac,
    });

    // return {
    //   data: responseDto,
    //   status: true,
    //   message: this.i18nService.translate('response.user.route.me.success', {
    //     lang,
    //   }),
    // };
  }

  @Patch('updateProfile')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        data: {
          userId: 'asdasdas-asdasd-asdasd',
          name: 'name',
          gender: 'MALE',
          birthDate: new Date(),
          height: 183,
          weight: 39,
          profileUrl: 'path image',
          horoscope: Horoscope.AQUARIUS,
          zodiac: Zodiac.DOG,
        } as UserProfileResponse,
        status: true,
        message: 'Success Message',
      } as BasicResponseSuccess,
    },
  })
  async updateProfile(
    @UserDecorator() user: UserJWTPayload,
    @Body() userProfileDto: UserProfileDto,
    @I18nLang() lang: string,
  // ): Promise<BasicResponseSuccess | FieldResponseError | BasicResponseError> {
    ) {
    const { birthDate } = userProfileDto;
    const horoscope: Horoscope = this.horoscopeService.checkHoroscope(
      new Date(birthDate),
    );
    const zodiac: Zodiac = this.zodiacService.checkZodiac(
      parseInt(birthDate.substring(0, 4)),
    );
    const profile: UserProfileSelected = await this.userProfileService.update(
      userProfileDto,
      user.id,
      horoscope,
      zodiac,
    );
    const responseDto: UserProfileResponse = new UserProfileResponse({
      userId: profile.userId,
      name: profile.name,
      gender: profile.gender,
      birthDate: profile.birthdate,
      height: profile.height,
      weight: profile.weight,
      profileUrl: profile.profileUrl,
      horoscope: profile.horoscope,
      zodiac: profile.zodiac,
    });

    // return {
    //   data: responseDto,
    //   status: true,
    //   message: this.i18nService.translate('response.user.route.me.success', {
    //     lang,
    //   }),
    // };
  }
}
