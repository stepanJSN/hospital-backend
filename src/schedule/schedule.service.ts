import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const numberOfDays = await this.prisma.schedule.createMany({
      data: createScheduleDto.schedule.map((elem) => ({
        staffId: createScheduleDto.staffId,
        dayOfWeek: elem.dayOfWeek,
        startTime: elem.startTime,
        endTime: elem.endTime,
      })),
    });

    return numberOfDays;
  }

  async createException(createScheduleException: CreateScheduleExceptionDto) {
    await this.prisma.scheduleException.create({
      data: {
        staff: {
          connect: {
            id: createScheduleException.staffId,
          },
        },
        date: new Date(createScheduleException.date),
        from: createScheduleException.from,
        to: createScheduleException.to,
      },
    });
  }

  async findAll(staffId: string) {
    const schedule = await this.prisma.schedule.findMany({
      where: {
        staffId,
      },
      omit: {
        id: true,
        staffId: true,
      },
    });

    const scheduleException = await this.prisma.scheduleException.findMany({
      where: {
        staffId,
      },
      omit: {
        staffId: true,
      },
    });
    return { schedule, scheduleException };
  }

  async remove(staffId: string) {
    await this.prisma.schedule.deleteMany({
      where: {
        staffId,
      },
    });
  }

  async removeScheduleException(exceptionId: string) {
    await this.prisma.scheduleException.delete({
      where: {
        id: exceptionId,
      },
    });
  }
}
