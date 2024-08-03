import { Storage } from '@google-cloud/storage';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleStorageModuleOptions } from './google-storage.module';
import { GOOGLE_STORAGE_OPTIONS } from './constants';

@Injectable()
export class GoogleStorageService {
  private readonly bucketName: string;
  private storage = new Storage();

  constructor(
    @Inject(GOOGLE_STORAGE_OPTIONS) options: GoogleStorageModuleOptions,
  ) {
    this.bucketName = options.bucketName;
  }

  async uploadFromMemory(filename: string, content: Express.Multer.File) {
    await this.storage
      .bucket(this.bucketName)
      .file(filename)
      .save(content.buffer);

    console.log('file was uploaded');
  }

  getAvatar(userId: string) {
    const avatar = this.storage
      .bucket(this.bucketName)
      .file(userId)
      .publicUrl();

    console.log('file was downloaded');

    return avatar;
  }

  async deleteAvatar(avatarUrl: string) {
    const filename = avatarUrl.split('/').pop();

    await this.storage.bucket(this.bucketName).file(filename).delete();
  }
}
