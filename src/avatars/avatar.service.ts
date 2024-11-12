import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from './storage.interface';

@Injectable()
export class AvatarsService {
  constructor(
    private prisma: PrismaService,
    @Inject('StorageService') private storage: StorageService,
  ) {}

  getImageURL(filename: string) {
    return this.storage.get(filename);
  }

  async upload(image: Express.Multer.File, userId: string) {
    const filename = image.originalname + Date.now();

    const { avatarUrl } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (avatarUrl) {
      await this.storage.delete(avatarUrl);
    }

    try {
      await this.storage.upload(filename, image);
    } catch (error) {
      console.log(error);
    }
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: filename,
      },
    });

    return this.getImageURL(filename);
  }

  async deleteByUserId(userId: string) {
    const { avatarUrl } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    await this.storage.delete(avatarUrl);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: null,
      },
    });
  }
}
