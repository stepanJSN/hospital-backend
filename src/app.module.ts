import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { SpecializationModule } from './specialization/specialization.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { GoogleStorageModule } from './google-storage/google-storage.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { AvatarsModule } from './avatars/avatar.module';

@Module({
  imports: [
    CustomersModule,
    PrismaModule,
    AuthModule,
    StaffModule,
    SpecializationModule,
    ScheduleModule,
    AppointmentsModule,
    GoogleStorageModule,
    NotificationsModule,
    AvatarsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
