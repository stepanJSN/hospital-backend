import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/guards/role.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { JWTPayload } from 'src/auth/types/auth.type';
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  create(
    @CurrentUser() user: JWTPayload,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    if (user.role === Role.Doctor && createScheduleDto.staffId !== user.id) {
      throw new ForbiddenException();
    }
    return this.scheduleService.create(createScheduleDto);
  }

  @Get(':staffId')
  findAllByStaffId(@Param('staffId') staffId: string) {
    return this.scheduleService.findAll(staffId);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Patch()
  async update(
    @CurrentUser() user: JWTPayload,
    @Body() updateScheduleDto: CreateScheduleDto,
  ) {
    if (user.role === Role.Doctor && updateScheduleDto.staffId !== user.id) {
      throw new ForbiddenException();
    }
    await this.scheduleService.remove(updateScheduleDto.staffId);
    return this.scheduleService.create(updateScheduleDto);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async updateScheduleException(
    @CurrentUser() user: JWTPayload,
    @Body() createScheduleExceptionDto: CreateScheduleExceptionDto,
  ) {
    if (
      user.role === Role.Doctor &&
      createScheduleExceptionDto.staffId !== user.id
    ) {
      throw new ForbiddenException();
    }
    await this.scheduleService.createException(createScheduleExceptionDto);
  }

  @Roles(Role.Admin, Role.Doctor)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async removeScheduleException(@Param('id') id: string) {
    await this.scheduleService.removeScheduleException(id);
  }
}
