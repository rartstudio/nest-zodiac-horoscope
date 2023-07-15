import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            cb(null, configService.get('PUBLIC_IMAGE_UPLOAD_PATH'));
          },
          filename: function (req, file, cb) {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(
                file.originalname,
              )}`.replace(/\\/g, '/'),
            );
          },
        }),
      }),
    }),
  ],
  exports: [MulterModule],
})
export class StorageModule {}
