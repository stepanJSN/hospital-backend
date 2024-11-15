import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from './storage.interface';

@Injectable()
export class AvatarsService {
  constructor(
    private prisma: PrismaService,
    @Inject('StorageService') private storage: StorageService,
  ) {}

  private async getAvatarUrl(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    return user?.avatarUrl;
  }

  private async deleteAvatarIfExists(avatarUrl: string) {
    if (avatarUrl) {
      try {
        await this.storage.delete(avatarUrl);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }
  }

  getImageURL(filename: string) {
    return this.storage.get(filename);
  }

  async upload(image: Express.Multer.File, userId: string) {
    const filename = image.originalname + Date.now();
    const avatarUrl = await this.getAvatarUrl(userId);
    await this.deleteAvatarIfExists(avatarUrl);
    if (avatarUrl) {
      await this.storage.delete(avatarUrl);
    }

    try {
      await this.storage.upload(filename, image);
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: filename },
      });
    } catch (error) {
      throw new Error('Failed to upload avatar: ' + error.message);
    }

    return this.getImageURL(filename);
  }

  async deleteByUserId(userId: string) {
    const avatarUrl = await this.getAvatarUrl(userId);
    await this.deleteAvatarIfExists(avatarUrl);

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });
  }
}
