import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
// import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    return await this.prisma.schedule.createMany({
      data: createScheduleDto.schedule.map((elem) => ({
        staffId: createScheduleDto.staffId,
        dayOfWeek: elem.dayOfWeek,
        startTime: elem.startTime,
        endTime: elem.endTime,
      })),
    });
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

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    return await this.prisma.schedule.updateMany({
      where: {
        staffId: id,
        dayOfWeek: updateScheduleDto.dayOfWeek,
      },
      data: {
        startTime: updateScheduleDto.startTime,
        endTime: updateScheduleDto.endTime,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
