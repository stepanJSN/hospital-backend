import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [CustomersModule, PrismaModule, AuthModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
