import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { GoogleStorageModule } from 'src/google-storage/google-storage.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AvatarsModule } from 'src/avatars/avatar.module';

@Module({
  imports: [
    NotificationsModule,
    AvatarsModule,
    GoogleStorageModule.register({
      bucketName: process.env.CUSTOMER_AVATAR_BUCKET_NAME,
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
