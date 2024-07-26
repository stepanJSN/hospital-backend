import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FindAllAppointmentsDto } from './dto/find-all-appointments.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from '@prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(Role.Customer)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  create(
    @CurrentUser('id') id: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(createAppointmentDto, id);
  }

  @Roles(Role.Admin, Role.Staff)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Get('/staff/:id')
  findAllByStaff(
    @Param('id') id: string,
    @Query() findAllAppointments: FindAllAppointmentsDto,
  ) {
    return this.appointmentsService.findAllByStaff(id, findAllAppointments);
  }

  @UsePipes(new ValidationPipe())
  @Get()
  findAllByCustomer(
    @CurrentUser('id') id: string,
    @Query() findAllAppointments: FindAllAppointmentsDto,
  ) {
    return this.appointmentsService.findAllByCustomer(id, findAllAppointments);
  }

  @Roles(Role.Admin, Role.Staff)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.appointmentsService.changeStatus(id, changeStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
