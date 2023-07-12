import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  RequestMethod,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { ValidationExceptionFactory } from './validation-exception.factory';
import { I18nService } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const whitelistUrl = ['http://localhost:4002', 'http://localhost:3000'];
  const config = new DocumentBuilder()
    .setTitle('')
    .setDescription('API Description')
    .setVersion('1')
    .addBearerAuth()
    .build();

  // Create an instance of the exception factory service
  const validationExceptionFactory = app.get(ValidationExceptionFactory);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        validationExceptionFactory.createException(
          errors,
          app.getHttpAdapter().getInstance(),
        ),
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(app.get(I18nService)));
  app.enableCors({
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    origin: function (origin, callback) {
      if (!origin || whitelistUrl.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
