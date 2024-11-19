import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';
import { OwnerOrAdminGuard } from 'src/guards/owner-admin.guard';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GetAvailableTimeDto } from './dto/get-available-time.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard, OwnerOrAdminGuard)
  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard, OwnerOrAdminGuard)
  @Post('exception')
  async createScheduleException(
    @Body() createScheduleExceptionDto: CreateScheduleExceptionDto,
  ) {
    return this.scheduleService.createException(createScheduleExceptionDto);
  }

  @Get(':staffId')
  async findAllByStaffId(@Param('staffId', ParseUUIDPipe) staffId: string) {
    return this.scheduleService.findAll(staffId);
  }

  @Get('/available')
  getStaffAvailableTime(@Query() getAvailableTime: GetAvailableTimeDto) {
    return this.scheduleService.getAvailableTime(getAvailableTime);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @Patch()
  async update(@Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(updateScheduleDto);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard, OwnerOrAdminGuard)
  @Delete(':userId')
  async removeSchedule(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.scheduleService.remove(userId);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @Delete('exception/:id')
  async removeScheduleException(@Param('id', ParseUUIDPipe) id: string) {
    await this.scheduleService.removeScheduleException(id);
  }
}
