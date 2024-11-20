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
    const { staffId, dateTime } = createAppointmentDto;
    const appointmentDate = dayjs(dateTime).toDate();
    const currentDateTime = dayjs().toDate();

    const conflictingAppointments = await this.prisma.appointments.findMany({
      where: {
        OR: [
          {
            staffId,
            customerId: userId,
            dateTime: {
              gt: currentDateTime,
            },
          },
          {
            customerId: userId,
            dateTime: appointmentDate,
          },
        ],
      },
    });

    if (conflictingAppointments.length > 0) {
      throw new BadRequestException(
        conflictingAppointments.some((app) => app.staffId === staffId)
          ? 'You have another appointment with this doctor'
          : 'You have an appointment with another doctor at this time. Check your appointments and try again.',
      );
    }

    const [newAppointment, user] = await Promise.all([
      this.prisma.appointments.create({
        data: {
          staffId,
          customerId: userId,
          dateTime: appointmentDate,
        },
      }),
      this.customersService.findOneById(userId),
    ]);

    await this.notificationsService.create({
      senderId: userId,
      receiverId: staffId,
      message: replacePlaceholders(messageTemplate.customerCreateAppointment, {
        customerName: user.name,
        customerSurname: user.surname,
        date: dayjs(dateTime).format('DD.MM.YYYY HH:mm'),
      }),
      subject: 'New appointment',
    });

    return newAppointment;
  }

  async findAppointments({
    fromDate,
    toDate,
    isCompleted,
    returnType,
    staffName,
    customerName,
    userId,
    page = 1,
    take = 10,
  }: FindAllAppointmentsDto) {
    const dateTimeFilter = this.createDateTimeFilter(fromDate, toDate);
    const isStaff = returnType === 'staff';
    const nameFilter = (customerName || staffName) && {
      user: {
        name: isStaff ? staffName.split(' ')[0] : customerName.split(' ')[0],
        surname: isStaff ? staffName.split(' ')[1] : customerName.split(' ')[1],
      },
    };

    const conditions = {
      customerId: userId,
      ...dateTimeFilter,
      ...(isCompleted === 'true'
        ? { isCompleted: true }
        : { isCompleted: false }),
      ...nameFilter,
    };

    const appointments = await this.prisma.appointments.findMany({
      where: conditions,
      select: {
        ...(isStaff
          ? {
              customer: {
                select: {
                  id: true,
                  user: { select: { name: true, surname: true } },
                },
              },
            }
          : {
              staff: {
                select: {
                  user: { select: { name: true, surname: true } },
                  specialization: { select: { title: true } },
                },
              },
            }),
      },
      orderBy: [{ isCompleted: 'asc' }, { dateTime: 'asc' }],
      skip: (page - 1) * take,
      take,
    });

    const totalCount = await this.prisma.appointments.count({
      where: conditions,
    });

    return {
      data: appointments,
      pagination: {
        page,
        take,
        total: totalCount,
      },
    };
  }

  private createDateTimeFilter(fromDate?: string, toDate?: string) {
    if (!fromDate && !toDate) return undefined;

    const filter: any = {};
    if (fromDate) {
      filter.gt = new Date(fromDate);
    }
    if (toDate) {
      filter.lte = dayjs(toDate).add(1, 'day').toDate();
    }
    return { dateTime: filter };
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
      where: { id },
    });

    const isCustomer = user.role === 'Customer';
    const userData = isCustomer
      ? await this.customersService.findOneById(user.id)
      : await this.staffService.findOneById(user.id);

    const receiverId = isCustomer
      ? deletedAppointment.staffId
      : deletedAppointment.customerId;

    const currentMessageTemplate = isCustomer
      ? messageTemplate.customerCancelAppointment
      : messageTemplate.doctorCancelAppointment;

    const message = replacePlaceholders(currentMessageTemplate, {
      name: userData.name,
      surname: userData.surname,
      date: dayjs(deletedAppointment.dateTime).format('DD.MM.YYYY HH:mm'),
    });

    await this.notificationsService.create({
      senderId: user.id,
      receiverId,
      message,
      type: 'Warning',
      subject: 'Appointment cancellation',
    });
  }
}
