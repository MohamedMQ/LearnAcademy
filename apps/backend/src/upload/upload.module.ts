import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const uploadDir = config.get<string>('UPLOAD_DIR', './uploads');
        if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

        return {
          storage: diskStorage({
            destination: uploadDir,
            filename: (_req, file, cb) => {
              const ext = extname(file.originalname);
              cb(null, `${uuidv4()}${ext}`);
            },
          }),
          limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
          fileFilter: (_req, file, cb) => {
            const allowed = /jpeg|jpg|png|webp|gif|mp4|webm|mov/;
            const ext = extname(file.originalname).toLowerCase().slice(1);
            if (allowed.test(ext)) {
              cb(null, true);
            } else {
              cb(new Error('Invalid file type'), false);
            }
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
