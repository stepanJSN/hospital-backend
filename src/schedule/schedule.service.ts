import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const numberOfDays = await this.prisma.schedule.createMany({
      data: new Array(7).map((_, index) => ({
        staffId: createScheduleDto.userId,
        dayOfWeek: index,
        startTime: null,
        endTime: null,
      })),
    });

    return numberOfDays;
  }

  async createException(createScheduleException: CreateScheduleExceptionDto) {
    await this.prisma.scheduleException.create({
      data: {
        staff: {
          connect: {
            id: createScheduleException.userId,
          },
        },
        date: new Date(createScheduleException.date),
      },
    });
  }

  async findAll(staffId: string) {
    const schedule = await this.prisma.schedule.findMany({
      where: {
        staffId,
      },
      omit: {
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

  async update(updateScheduleDto: UpdateScheduleDto) {
    return await this.prisma.schedule.update({
      where: { id: updateScheduleDto.id },
      data: {
        from: updateScheduleDto.from,
        to: updateScheduleDto.to,
      },
    });
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
