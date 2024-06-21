import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { SpecializationModule } from './specialization/specialization.module';

@Module({
  imports: [CustomersModule, PrismaModule, AuthModule, StaffModule, SpecializationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
