import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto) {
    const user = await this.prisma.staff.create({
      data: {
        ...createStaffDto,
        birthday: new Date(createStaffDto.birthday),
      },
    });
    return user;
  }

  findAll() {
    return this.prisma.staff.findMany();
  }

  findOneById(id: string) {
    return this.prisma.staff.findUnique({
      where: {
        id,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.staff.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const data = { ...updateStaffDto };
    if (updateStaffDto.birthday) {
      data.birthday = new Date(updateStaffDto.birthday);
    } else {
      delete data.birthday;
    }

    const updateUser = await this.prisma.staff.update({
      where: {
        id,
      },
      data,
    });
    return updateUser;
  }

  async remove(id: string) {
    await this.prisma.staff.delete({
      where: {
        id,
      },
    });
  }
}
