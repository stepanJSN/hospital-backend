import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStorageService {
  private storage = new Storage();

  async uploadFromMemory(filename: string, content: Express.Multer.File) {
    await this.storage
      .bucket('hospital-customer-avatar')
      .file(filename)
      .save(content.buffer);

    console.log('file was uploaded');
  }

  getAvatar(userId: string) {
    const avatar = this.storage
      .bucket('hospital-customer-avatar')
      .file(userId)
      .publicUrl();

    console.log('file was downloaded');

    return avatar;
  }

  async deleteAvatar(avatarUrl: string) {
    const filename = avatarUrl.split('/').pop();

    await this.storage
      .bucket('hospital-customer-avatar')
      .file(filename)
      .delete();
  }
}
