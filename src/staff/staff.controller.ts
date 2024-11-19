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
  ParseUUIDPipe,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FindAllStaffDto } from './dto/find-all-staff.dto';
import { OwnerOrAdminGuard } from 'src/guards/owner-admin.guard';
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const staffMember = await this.staffService.findOneById(id);
    if (!staffMember) {
      throw new NotFoundException('Employee not found');
    }
    return staffMember;
  }

  @Get()
  findAll(@Query() findAllStaffDto: FindAllStaffDto) {
    return this.staffService.findAll(findAllStaffDto);
  }

  @UseGuards(OwnerOrAdminGuard)
  @Patch('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.staffService.remove(id);
    return { message: 'Staff member was deleted successfully' };
  }
}
