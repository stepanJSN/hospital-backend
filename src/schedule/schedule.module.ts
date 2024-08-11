import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [NotificationsModule, StaffModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
