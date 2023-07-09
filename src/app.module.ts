import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationExceptionFactory } from './validation-exception.factory';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { AuthUserTokenModule } from './auth-user-token/auth-user-token.module';
import { StorageModule } from './storage/storage.module';
import { UserStorageModule } from './user-storage/user-storage.module';
import { TokenModule } from './token/token.module';
import { HoroscopeModule } from './horoscope/horoscope.module';
import { ZodiacModule } from './zodiac/zodiac.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        APP_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      }),
    }),
    I18nModule.forRoot({
      logging: true,
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        id: 'id',
      },
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
      typesOutputPath: join(
        __dirname,
        '../src/i18n/generated/i18n.generated.ts',
      ),
    }),
    HttpModule,
    PrismaModule,
    AuthModule,
    UserModule,
    HealthModule,
    TokenModule,
    AuthUserTokenModule,
    StorageModule,
    UserStorageModule,
    HoroscopeModule,
    ZodiacModule,
    UserProfileModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    ValidationExceptionFactory,
  ],
})
export class AppModule {}
