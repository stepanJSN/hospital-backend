import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';

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
    return user;
  }

  findAll(specializationId?: string, date?: string) {
    const select = {
      id: true,
      name: true,
      surname: true,
      experience: true,
      gender: true,
      specialization: {
        select: {
          title: true,
        },
      },
    };

    if (date) {
      return this.prisma.staff.findMany({
        where: {
          specializationId,
          schedule: {
            some: {
              dayOfWeek: {
                equals: new Date(date).getDay(),
              },
            },
          },
        },
        select: select,
      });
    }
    return this.prisma.staff.findMany({
      where: {
        specializationId,
      },
      select: select,
    });
  }

  findOneById(id: string) {
    return this.prisma.staff.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        surname: true,
        email: true,
        telephone: true,
        birthday: true,
        specialization: {
          select: {
            title: true,
          },
        },
        gender: true,
        experience: true,
        description: true,
        room: true,
      },
    });
  }

  async getAvailableTime(staffId: string, startDate: string, endDate: string) {
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);
    const dataDB = await this.prisma.staff.findUnique({
      where: {
        id: staffId,
      },
      select: {
        schedule: true,
        appointments: {
          where: {
            dateTime: {
              gte: startDateParsed,
              lte: endDateParsed,
            },
          },
        },
      },
    });
    const result = [];

    for (
      let index = new Date(startDateParsed);
      index < endDateParsed;
      index.setDate(index.getDate() + 1)
    ) {
      const day = dataDB.schedule.find(
        (element) =>
          element.dayOfWeek === index.getDay() && element.startTime !== null,
      );
      if (day) {
        const oneDay = {
          dayOfWeek: new Date(index),
          startTime: day.startTime,
          endTime: day.endTime,
          bookedTime: [],
        };
        for (let i = day.startTime; i < day.endTime; i++) {
          if (
            dataDB.appointments.find((element) => {
              const appointmentDate = dayjs(element.dateTime);
              return (
                appointmentDate.get('hours') === i &&
                appointmentDate.get('day') === index.getDay()
              );
            })
          ) {
            oneDay.bookedTime.push(i);
          }
        }
        result.push(oneDay);
      } else {
        result.push({ dayOfWeek: new Date(index) });
      }
    }

    return result;
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
