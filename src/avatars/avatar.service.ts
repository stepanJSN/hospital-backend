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
    try {
      await this.storage.upload(filename, image);
    } catch (error) {
      console.log(error);
    }
    await this.prisma.avatars.create({
      data: {
        userId,
        imageUrl: filename,
      },
    });

    return this.getImageURL(filename);
  }

  async deleteByUserId(userId: string) {
    const userAvatars = await this.prisma.avatars.findMany({
      where: {
        userId,
      },
    });
    await Promise.all(
      userAvatars.map(async (userAvatar) => {
        await this.storage.delete(userAvatar.imageUrl);
      }),
    );
    await this.prisma.avatars.deleteMany({
      where: {
        userId,
      },
    });
  }

  // async delete(imageId: string) {
  //   const deletedImage = await this.prisma.images.delete({
  //     where: {
  //       id: imageId,
  //     },
  //   });
  //   await this.storage.delete(deletedImage.url);
  //   return await this.getAllBySuperheroId(deletedImage.superheroId);
  // }
}
