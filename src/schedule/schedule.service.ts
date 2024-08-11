import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { StaffService } from 'src/staff/staff.service';
import { replacePlaceholders } from 'src/utils/replacePlaceholders';
import { messageTemplate } from 'src/notifications/notifications.config';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private staffService: StaffService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const numberOfDays = await this.prisma.schedule.createMany({
      data: createScheduleDto.schedule.map((elem) => ({
        staffId: createScheduleDto.staffId,
        dayOfWeek: elem.dayOfWeek,
        startTime: elem.startTime,
        endTime: elem.endTime,
      })),
    });

    const admins = await this.staffService.findAllAdmins();
    const currentStaffMember = await this.staffService.findOneById(
      createScheduleDto.staffId,
    );
    this.notificationsService.create({
      sender: createScheduleDto.staffId,
      senderName: `${currentStaffMember.name} ${currentStaffMember.surname}`,
      receiversId: admins.map((admin) => admin.id),
      message: replacePlaceholders(messageTemplate.doctorChangeSchedule, {
        name: currentStaffMember.name,
        surname: currentStaffMember.surname,
      }),
      type: 'Warning',
      isRead: false,
      date: new Date(),
    });

    return numberOfDays;
  }

  findAll(id: string) {
    return this.prisma.schedule.findMany({
      where: {
        staffId: id,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  remove(staffId: string) {
    return this.prisma.schedule.deleteMany({
      where: {
        staffId,
      },
    });
  }
}
