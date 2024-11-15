import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { GoogleStorageModule } from 'src/google-storage/google-storage.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AvatarsModule } from 'src/avatars/avatar.module';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NotificationsModule,
    AvatarsModule,
    EmailConfirmationModule,
    GoogleStorageModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        bucketName: configService.get<string>('CUSTOMER_AVATAR_BUCKET_NAME'),
      }),
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
