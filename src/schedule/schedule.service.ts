import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
// import { UpdateScheduleDto } from './dto/update-schedule.dto';
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

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  // update(id: number, updateScheduleDto: UpdateScheduleDto) {
  //   return `This action updates a #${id} schedule`;
  // }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
