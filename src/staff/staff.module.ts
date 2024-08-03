import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { GoogleStorageModule } from 'src/google-storage/google-storage.module';

@Module({
  imports: [
    GoogleStorageModule.register({
      bucketName: process.env.STAFF_AVATAR_BUCKET_NAME,
    }),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
