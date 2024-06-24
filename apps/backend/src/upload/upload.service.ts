import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {}

  getFileUrl(filename: string): string {
    const base = this.config.get<string>('FRONTEND_URL', 'http://localhost:3001');
    return `${base}/uploads/${filename}`;
  }
}
