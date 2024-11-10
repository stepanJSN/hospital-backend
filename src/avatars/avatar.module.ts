import { Module } from '@nestjs/common';
import { AvatarsService } from './avatar.service';
import { AvatarsController } from './avatar.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStorageService } from 'src/google-storage/google-storage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'StorageService',
      useFactory: (configService: ConfigService) => {
        const bucketName = configService.get<string>('IMAGE_BUCKET_NAME', {
          infer: true,
        });
        return new GoogleStorageService(configService, {
          bucketName: bucketName,
        });
      },
      inject: [ConfigService],
    },
    AvatarsService,
  ],
  exports: [AvatarsService],
  controllers: [AvatarsController],
})
export class AvatarsModule {}
