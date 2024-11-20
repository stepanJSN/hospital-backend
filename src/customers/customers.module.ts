import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AvatarsModule } from 'src/avatars/avatar.module';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';

@Module({
  imports: [NotificationsModule, AvatarsModule, EmailConfirmationModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
