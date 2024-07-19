import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FindAllAppointmentsDto } from './dto/find-all-appointments.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @CurrentUser('uid') id: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(createAppointmentDto, id);
  }

  @Get('/staff/:id')
  findAllByStaff(
    @Param('id') id: string,
    @Query() findAllAppointments: FindAllAppointmentsDto,
  ) {
    return this.appointmentsService.findAllByStaff(id, findAllAppointments);
  }

  @Get()
  findAllByCustomer(
    @CurrentUser('uid') id: string,
    @Query() findAllAppointments: FindAllAppointmentsDto,
  ) {
    return this.appointmentsService.findAllByCustomer(id, findAllAppointments);
  }

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
