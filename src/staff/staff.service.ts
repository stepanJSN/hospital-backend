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
        email: createStaffDto.email,
        name: createStaffDto.name,
        surname: createStaffDto.surname,
        telephone: createStaffDto.telephone,
        gender: createStaffDto.gender,
        password: createStaffDto.password,
        experience: createStaffDto.experience,
        role: createStaffDto.role,
        birthday: new Date(createStaffDto.birthday),
      },
    });
    this.prisma.schedule.createMany({
      data: createStaffDto.schedule.map((day) => ({
        staffId: user.id,
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
      })),
    });
    return user;
  }

  // findAll(specialization: string, dateTime: string) {
  //   return this.prisma.staff.findMany({
  //   });
  // }

  findOneById(id: string) {
    return this.prisma.staff.findUnique({
      where: {
        id,
      },
      select: {
        password: false,
        role: false,
        birthday: false,
        schedule: true,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.staff.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
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
