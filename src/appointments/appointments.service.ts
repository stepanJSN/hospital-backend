import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import { FindAllAppointmentsDto } from './dto/find-all-appointments.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
// import utc from 'dayjs/plugin/utc';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';

// dayjs.extend(utc);

type FindAllWhereType = {
  dateTime?: {
    gt?: Date;
    lte?: Date;
  };
  isCompleted?: boolean;
  customerId?: string;
  staffId?: string;
};

function whereAll(id: string, idName: string, params: FindAllAppointmentsDto) {
  const whereRes: FindAllWhereType = {
    [idName]: id,
  };
  if (params.isCompleted) {
    whereRes.isCompleted = true;
  }
  if (params.startDate || params.endDate) {
    whereRes.dateTime = {};
  }
  if (params.startDate) {
    whereRes.dateTime.gt = new Date(params.startDate);
  }
  if (params.endDate) {
    whereRes.dateTime.lte = dayjs(params.endDate).add(1, 'day').toDate();
  }
  return whereRes;
}

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    return this.prisma.appointments.create({
      data: {
        staffId: createAppointmentDto.staffId,
        customerId: userId,
        dateTime: dayjs(createAppointmentDto.dateTime).toDate(),
      },
    });
  }

  findAllByCustomer(id: string, params: FindAllAppointmentsDto) {
    return this.prisma.appointments.findMany({
      where: whereAll(id, 'customerId', params),
      select: {
        id: true,
        dateTime: true,
        isCompleted: true,
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
      orderBy: [{ isCompleted: 'asc' }, { dateTime: 'asc' }],
    });
  }

  findAllByStaff(id: string, params: FindAllAppointmentsDto) {
    return this.prisma.appointments.findMany({
      where: whereAll(id, 'staffId', params),
      select: {
        id: true,
        dateTime: true,
        isCompleted: true,
        customer: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
      orderBy: [{ isCompleted: 'asc' }, { dateTime: 'asc' }],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  changeStatus(id: string, changeStatusDto: ChangeStatusDto) {
    return this.prisma.appointments.update({
      where: {
        id,
      },
      data: {
        isCompleted: changeStatusDto.isCompleted,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.appointments.delete({
      where: {
        id,
      },
    });
  }
}
