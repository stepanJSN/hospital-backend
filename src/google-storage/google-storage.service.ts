import { Storage } from '@google-cloud/storage';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleStorageModuleOptions } from './google-storage.module';
import { GOOGLE_STORAGE_URL } from './constants';
import { StorageService } from 'src/avatars/storage.interface';
import { ConfigService } from '@nestjs/config';
import { MODULE_OPTIONS_TOKEN } from './google-storage.module-definition';

@Injectable()
export class GoogleStorageService implements StorageService {
  private readonly bucketName: string;
  private storage = new Storage();

  constructor(
    private configService: ConfigService,
    @Inject(MODULE_OPTIONS_TOKEN) options: GoogleStorageModuleOptions,
  ) {
    this.bucketName = options.bucketName;
  }

  get(filename: string) {
    return `${GOOGLE_STORAGE_URL}${this.configService.get<string>('CUSTOMER_AVATAR_BUCKET_NAME')}/${filename}`;
  }

  async upload(filename: string, content: Express.Multer.File) {
    try {
      await this.storage
        .bucket(this.bucketName)
        .file(filename)
        .save(content.buffer);
    } catch (error) {
      console.error('Error uploading file to Google Cloud Storage:', error);
      throw new Error('Failed to upload file');
    }
  }

  async delete(avatarUrl: string) {
    const filename = avatarUrl.split('/').pop();

    if (!filename) {
      throw new Error('Invalid file URL');
    }

    try {
      await this.storage.bucket(this.bucketName).file(filename).delete();
    } catch (error) {
      console.error('Error deleting file from Google Cloud Storage:', error);
      throw new Error('Failed to delete file');
    }
  }
}
