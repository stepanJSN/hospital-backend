import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CustomersModule } from 'src/customers/customers.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [NotificationsModule, CustomersModule, StaffModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
