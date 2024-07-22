import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get(':staffId')
  findAllByStaffId(@Param('staffId') staffId: string) {
    return this.scheduleService.findAll(staffId);
  }

  @Patch()
  async update(@Body() updateScheduleDto: CreateScheduleDto) {
    await this.scheduleService.remove(updateScheduleDto.staffId);
    return this.scheduleService.create(updateScheduleDto);
  }

  @Delete(':staffId')
  remove(@Param('staffId') id: string) {
    return this.scheduleService.remove(id);
  }
}
