import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';

dayjs.extend(utc);

type FindAllWhereType = {
  dateTime?: {
    gt?: Date;
    lte?: Date;
  };
  customerId: string;
};

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

  findAll(id: string, startDate?: string, endDate?: string) {
    function where(id: string, startDate?: string, endDate?: string) {
      const whereRes: FindAllWhereType = {
        customerId: id,
      };
      if (startDate || endDate) {
        whereRes.dateTime = {};
      }
      if (startDate) {
        whereRes.dateTime.gt = new Date(startDate);
      }
      if (endDate) {
        whereRes.dateTime.lte = dayjs(endDate).add(1, 'day').toDate();
      }
      return whereRes;
    }

    return this.prisma.appointments.findMany({
      where: where(id, startDate, endDate),
      select: {
        id: true,
        dateTime: true,
        staff: {
          select: {
            name: true,
            surname: true,
            specialization: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
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
