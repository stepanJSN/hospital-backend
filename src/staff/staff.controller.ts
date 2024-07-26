import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  ForbiddenException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { JWTPayload } from 'src/auth/types/auth.type';
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get('/schedule')
  getAvailableTime(
    @Query() query: { staffId: string; startDate: string; endDate: string },
  ) {
    return this.staffService.getAvailableTime(
      query.staffId,
      query.startDate,
      query.endDate,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const staffMember = await this.staffService.findOneById(id);
    if (!staffMember) {
      throw new NotFoundException('Employee not found');
    }
    return staffMember;
  }

  @Get()
  findAll(
    @CurrentUser('role') role: Role,
    @Query()
    query: {
      specializationId?: string;
      date?: string;
      fullName?: string;
    },
  ) {
    if (query.fullName) {
      const [name, surname] = query.fullName.split(' ');
      return this.staffService.findAll(
        role,
        query.specializationId,
        query.date,
        surname,
        name,
      );
    }
    return this.staffService.findAll(role, query.specializationId, query.date);
  }

  @Roles(Role.Admin, Role.Staff)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/:id')
  update(
    @CurrentUser() user: JWTPayload,
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    if (user.role === Role.Staff && id !== user.id) {
      throw new ForbiddenException();
    }
    return this.staffService.update(id, updateStaffDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
