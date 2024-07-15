import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';

dayjs.extend(utc);

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    return this.prisma.appointments.create({
      data: {
        staffId: createAppointmentDto.staffId,
        customerId: userId,
        dateTime: dayjs.utc(createAppointmentDto.dateTime).local().toDate(),
      },
    });
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  // update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   return `This action updates a #${id} appointment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
