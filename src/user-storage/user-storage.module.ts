import { Module } from '@nestjs/common';
import { UserStorageController } from './user-storage.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        storage: multerS3({
          s3: new S3Client({
            forcePathStyle: true,
            endpoint: configService.get('OBJECT_STORAGE_URL'),
            region: configService.get('OBJECT_STORAGE_REGION'),
            credentials: {
              accessKeyId: configService.get('OBJECT_STORAGE_ACCESS_KEY'),
              secretAccessKey: configService.get('OBJECT_STORAGE_SECRET_KEY'),
            },
          }),
          acl: 'public-read',
          bucket: configService.get('OBJECT_STORAGE_BUCKET'),
          metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
          },
          key: function (req, file, cb) {
            cb(null, `${Date.now() + extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [UserStorageController],
})
export class UserStorageModule {}
