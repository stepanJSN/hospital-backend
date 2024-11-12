import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { GoogleStorageModule } from 'src/google-storage/google-storage.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    GoogleStorageModule.register({
      bucketName: process.env.CUSTOMER_AVATAR_BUCKET_NAME,
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
