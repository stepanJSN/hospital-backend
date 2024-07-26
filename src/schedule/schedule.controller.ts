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
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { JWTPayload } from 'src/auth/types/auth.type';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Roles(Role.Admin, Role.Staff)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  create(
    @CurrentUser() user: JWTPayload,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    if (user.role === Role.Staff && createScheduleDto.staffId !== user.id) {
      throw new ForbiddenException();
    }
    return this.scheduleService.create(createScheduleDto);
  }

  @Get(':staffId')
  findAllByStaffId(@Param('staffId') staffId: string) {
    return this.scheduleService.findAll(staffId);
  }

  @Roles(Role.Admin, Role.Staff)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Patch()
  async update(
    @CurrentUser() user: JWTPayload,
    @Body() updateScheduleDto: CreateScheduleDto,
  ) {
    if (user.role === Role.Staff && updateScheduleDto.staffId !== user.id) {
      throw new ForbiddenException();
    }
    await this.scheduleService.remove(updateScheduleDto.staffId);
    return this.scheduleService.create(updateScheduleDto);
  }
}
