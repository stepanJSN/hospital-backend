import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { FindAllAppointmentsDto } from './dto/find-all-appointments.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from '@prisma/client';
import { JWTPayload } from 'src/auth/types/auth.type';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @CurrentUser('id') id: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(createAppointmentDto, id);
  }

  @Get()
  findAll(@Query() findAllAppointments: FindAllAppointmentsDto) {
    return this.appointmentsService.findAppointments(findAllAppointments);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.appointmentsService.changeStatus(id, changeStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JWTPayload) {
    return this.appointmentsService.remove(id, user);
  }
}
