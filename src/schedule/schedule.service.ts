import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  remove(staffId: string) {
    return this.prisma.schedule.deleteMany({
      where: {
        staffId,
      },
    });
  }
}
