import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  // create(createScheduleDto: CreateScheduleDto) {

  //   this.prisma.schedule.create({
  //     data: createScheduleDto,
  //   });
  // }

  // findStaffSchedule(staffId: string, dayOfWeek: number) {
  //   return this.prisma.schedule.findMany({
  //     where: {
  //       AND: [
  //         {
  //           staffId,
  //         },
  //         {
  //           dayOfWeek,
  //         },
  //       ],
  //     },
  //   });
  // }

  update(scheduleId: string, data: UpdateScheduleDto) {
    return this.prisma.schedule.update({
      where: {
        id: scheduleId,
      },
      data,
    });
  }
}
