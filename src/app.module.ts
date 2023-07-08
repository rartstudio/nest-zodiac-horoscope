import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationExceptionFactory } from './validation-exception.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { BullModule } from '@nestjs/bull';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';
import { AuthUserTokenModule } from './auth-user-token/auth-user-token.module';
import { UserEmailOtpQueueModule } from './user-email-otp-queue/user-email-otp-queue.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { AuthUserTokenOtpEmailQueueModule } from './auth-user-token-otp-email-queue/auth-user-token-otp-email-queue.module';
import { StorageModule } from './storage/storage.module';
import { UserStorageModule } from './user-storage/user-storage.module';
import { TokenModule } from './token/token.module';
import { PostModule } from './post/post.module';
import { UserPostModule } from './user-post/user-post.module';
import { PostLikeModule } from './post-like/post-like.module';
import { UserPostLikeModule } from './user-post-like/user-post-like.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { UserPostCommentModule } from './user-post-comment/user-post-comment.module';

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
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USERNAME: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM_ADDRESS: Joi.string().required(),
        MAIL_SECURE: Joi.bool().required(),
        OBJECT_STORAGE_BUCKET: Joi.string().required(),
        OBJECT_STORAGE_REGION: Joi.string().required(),
        OBJECT_STORAGE_URL: Joi.string().required(),
        OBJECT_STORAGE_ACCESS_KEY: Joi.string().required(),
        OBJECT_STORAGE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
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
    OtpModule,
    EmailModule,
    TokenModule,
    UserEmailOtpQueueModule,
    AuthUserModule,
    AuthUserTokenModule,
    AuthUserTokenOtpEmailQueueModule,
    StorageModule,
    UserStorageModule,
    PostModule,
    UserPostModule,
    PostLikeModule,
    UserPostLikeModule,
    PostCommentModule,
    UserPostCommentModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    ValidationExceptionFactory,
  ],
})
export class AppModule {}
