import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetAvailableTimeDto } from './dto/get-available-time.dto';

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

  async getAvailableTime({ staffId, startDate, endDate }: GetAvailableTimeDto) {
    const [scheduleData, bookedHoursMap] = await Promise.all([
      this.getStaffScheduleData(staffId, startDate, endDate),
      this.getBookedHoursMap(staffId, startDate, endDate),
    ]);

    return this.calculateAvailableTime(
      scheduleData,
      bookedHoursMap,
      startDate,
      endDate,
    );
  }

  private async getStaffScheduleData(
    staffId: string,
    startDate: string,
    endDate: string,
  ) {
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);

    return await this.prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        schedule: {
          where: {
            dayOfWeek: {
              gte: startDateParsed.getDay(),
              lte: endDateParsed.getDay(),
            },
          },
        },
        scheduleExceptions: true,
        appointments: {
          where: {
            dateTime: {
              gte: startDateParsed,
              lte: endDateParsed,
            },
          },
        },
      },
    });
  }

  private async getBookedHoursMap(
    staffId: string,
    startDate: string,
    endDate: string,
  ) {
    const appointments = await this.prisma.appointments.findMany({
      where: {
        staffId,
        dateTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    const bookedHoursMap = new Map<string, Set<number>>();
    appointments.forEach((appointment) => {
      const dateKey = appointment.dateTime.toISOString().split('T')[0];
      const hour = appointment.dateTime.getHours();

      if (!bookedHoursMap.has(dateKey)) {
        bookedHoursMap.set(dateKey, new Set());
      }
      bookedHoursMap.get(dateKey)?.add(hour);
    });

    return bookedHoursMap;
  }

  private calculateAvailableTime(
    scheduleData,
    bookedHoursMap,
    startDate,
    endDate,
  ) {
    const availableTime: { date: string; availableSlots: number[] }[] = [];

    for (
      let d = new Date(startDate);
      d <= new Date(endDate);
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];

      const exception = scheduleData.scheduleExceptions.find(
        (ex) => ex.date.toISOString().split('T')[0] === dateStr,
      );
      if (exception) {
        continue;
      }

      const daySchedule = scheduleData.schedule.find(
        (sch) => sch.dayOfWeek === dayOfWeek,
      );

      if (daySchedule && daySchedule.from !== null && daySchedule.to !== null) {
        const availableSlots: number[] = [];
        const bookedHours = bookedHoursMap.get(dateStr) || new Set();

        for (let hour = daySchedule.from; hour < daySchedule.to; hour++) {
          if (!bookedHours.has(hour)) {
            availableSlots.push(hour);
          }
        }

        if (availableSlots.length > 0) {
          availableTime.push({ date: dateStr, availableSlots });
        }
      }
    }

    return availableTime;
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
