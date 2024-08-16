import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import { FindAllAppointmentsDto } from './dto/find-all-appointments.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CustomersService } from 'src/customers/customers.service';
import { StaffService } from 'src/staff/staff.service';
import { JWTPayload } from 'src/auth/types/auth.type';
import { Role } from '@prisma/client';
import { replacePlaceholders } from 'src/utils/replacePlaceholders';
import { messageTemplate } from 'src/notifications/notifications.config';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private customersService: CustomersService,
    private staffService: StaffService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const oldAppointments = await this.prisma.appointments.findMany({
      where: {
        staffId: createAppointmentDto.staffId,
        customerId: userId,
        dateTime: {
          gt: dayjs().toDate(),
        },
      },
    });
    if (oldAppointments.length > 0) {
      throw new BadRequestException(
        'You have another appointment with this doctor',
      );
    }

    const customerAppointments = await this.prisma.appointments.findMany({
      where: {
        customerId: userId,
        dateTime: dayjs(createAppointmentDto.dateTime).toDate(),
      },
    });

    if (customerAppointments.length > 0) {
      throw new BadRequestException(
        'You have an appointment with another doctor at this time. Check your appointments and try again.',
      );
    }

    const newAppointment = this.prisma.appointments.create({
      data: {
        staffId: createAppointmentDto.staffId,
        customerId: userId,
        dateTime: dayjs(createAppointmentDto.dateTime).toDate(),
      },
    });

    const user = await this.customersService.findOneById(userId);

    this.notificationsService.create({
      sender: userId,
      senderName: `${user.name} ${user.surname}`,
      receiversId: [createAppointmentDto.staffId],
      message: replacePlaceholders(messageTemplate.customerCreateAppointment, {
        customerName: user.name,
        customerSurname: user.surname,
        date: dayjs(createAppointmentDto.dateTime).format('DD.MM.YYYY HH:mm'),
      }),
      type: 'Info',
      isRead: false,
      date: new Date(),
    });

    return newAppointment;
  }

  findAll(data: FindAllAppointmentsDto) {
    return this.prisma.appointments.findMany({
      where: {
        ...(data.fromDate && {
          dateTime: {
            gt: new Date(data.fromDate),
          },
        }),
        ...(data.toDate && {
          dateTime: {
            lte: dayjs(data.toDate).add(1, 'day').toDate(),
          },
        }),
        ...(data.returnType === 'staff'
          ? { customerId: data.userId }
          : { staffId: data.userId }),
        ...(data.isCompleted === 'false' ? { isCompleted: false } : {}),
        ...(data.customerName && {
          customer: {
            name: data.customerName.split(' ')[0],
            surname: data.customerName.split(' ')[1],
          },
        }),
        ...(data.staffName && {
          staff: {
            name: data.staffName.split(' ')[0],
            surname: data.staffName.split(' ')[1],
          },
        }),
      },
      select: {
        id: true,
        dateTime: true,
        isCompleted: true,
        ...(data.returnType === 'staff'
          ? {
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
            }
          : {
              customer: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                },
              },
            }),
      },
      orderBy: [{ isCompleted: 'asc' }, { dateTime: 'asc' }],
    });
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

  async remove(id: string, user: JWTPayload) {
    const deletedAppointment = await this.prisma.appointments.delete({
      where: {
        id,
      },
    });
    const userData =
      user.role === Role.Customer
        ? await this.customersService.findOneById(user.id)
        : await this.staffService.findOneById(user.id);
    const receiverId =
      user.role === Role.Customer
        ? deletedAppointment.staffId
        : deletedAppointment.customerId;
    const currentMessageTemplate =
      user.role === Role.Customer
        ? messageTemplate.customerCancelAppointment
        : messageTemplate.doctorCancelAppointment;

    this.notificationsService.create({
      sender: user.id,
      senderName: `${userData.name} ${userData.surname}`,
      receiversId: [receiverId],
      message: replacePlaceholders(currentMessageTemplate, {
        name: userData.name,
        surname: userData.surname,
        date: dayjs(deletedAppointment.dateTime).format('DD.MM.YYYY HH:mm'),
      }),
      type: 'Warning',
      isRead: false,
      date: new Date(),
    });
  }
}
