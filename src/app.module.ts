import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { SpecializationModule } from './specialization/specialization.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { GoogleStorageModule } from './google-storage/google-storage.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AvatarsModule } from './avatars/avatar.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    CustomersModule,
    PrismaModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
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
    EmailConfirmationModule,
    ResetPasswordModule,
  ],
})
export class AppModule {}
