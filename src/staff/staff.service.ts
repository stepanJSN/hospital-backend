import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { hash } from 'argon2';

type FindAllWhere = {
  role?: {
    not: Role;
  };
  name?: {
    startsWith: string;
    mode: 'insensitive';
  };
  surname?: {
    startsWith: string;
    mode: 'insensitive';
  };
  specializationId?: string;
  specialization?: {
    isNot: null;
  };
};

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto) {
    const user = await this.findOneByEmail(createStaffDto.email);

    if (user) {
      throw new BadRequestException('Staff member already exists');
    }

    const { id } = await this.prisma.staff.create({
      data: {
        user: {
          create: {
            ...createStaffDto,
            isEmailVerified: true,
            password: await hash(createStaffDto.password),
            birthday: new Date(createStaffDto.birthday),
          },
        },
      },
    });
    return id;
  }

  findAll(
    role: Role,
    specializationId?: string,
    surname?: string,
    name?: string,
  ) {
    const where: FindAllWhere = {};
    if (role !== Role.Admin) {
      where.role = {
        not: Role.Admin,
      };
      where.specialization = {
        isNot: null,
      };
    }
    if (specializationId) {
      where.specializationId = specializationId;
    }
    if (surname) {
      where.surname = {
        startsWith: surname,
        mode: 'insensitive',
      };
    }
    if (name) {
      where.name = {
        startsWith: name,
        mode: 'insensitive',
      };
    }

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

    return this.prisma.staff.findMany({
      where: where,
      select: select,
    });
  }

  findAllAdmins() {
    return this.prisma.staff.findMany({
      where: {
        role: 'Admin',
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findOneById(id: string) {
    const employee = await this.prisma.staff.findUnique({
      where: {
        id,
      },
      include: {
        specialization: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    const result = {
      ...employee,
      ...employee.user,
    };
    delete result.user;

    return result;
  }

  async getAvailableTime(staffId: string, startDate: string, endDate: string) {
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);

    const { schedule, scheduleExceptions, appointments } =
      await this.prisma.staff.findUnique({
        where: {
          id: staffId,
        },
        select: {
          schedule: {
            where: {
              dayOfWeek: {
                gte: startDateParsed.getDay(),
                lte: endDateParsed.getDay(),
              },
            },
          },
          scheduleExceptions: true,
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

    const availableTime: { date: string; availableSlots: number[] }[] = [];
    const bookedHoursMap = new Map<string, Set<number>>();

    appointments.forEach((appointment) => {
      const dateKey = appointment.dateTime.toISOString().split('T')[0];
      const hour = appointment.dateTime.getHours();

      if (!bookedHoursMap.has(dateKey)) {
        bookedHoursMap.set(dateKey, new Set());
      }
      bookedHoursMap.get(dateKey)?.add(hour);
    });

    for (
      let d = new Date(startDateParsed);
      d <= endDateParsed;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];

      const exception = scheduleExceptions.find(
        (ex) => ex.date.toISOString().split('T')[0] === dateStr,
      );
      if (exception) {
        continue;
      }

      const daySchedule = schedule.find((sch) => sch.dayOfWeek === dayOfWeek);

      if (daySchedule && daySchedule.from !== null && daySchedule.to !== null) {
        const availableSlots: number[] = [];
        const bookedHours = bookedHoursMap.get(dateStr) || new Set();

        for (let hour = daySchedule.from; hour < daySchedule.to; hour++) {
          if (!bookedHours.has(hour)) {
            availableSlots.push(hour);
          }
        }

        if (availableSlots.length > 0) {
          availableTime.push({ date: dateStr, availableSlots });
        }
      }
    }

    return availableTime;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        isEmailVerified: true,
        staff: true,
      },
    });
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const data = { ...updateStaffDto };
    if (updateStaffDto.birthday) {
      data.birthday = new Date(updateStaffDto.birthday);
    }

    const updateUser = await this.prisma.staff.update({
      where: {
        id,
      },
      data: {
        specialization: {
          connect: {
            id: updateStaffDto.specializationId,
          },
        },
        experience: updateStaffDto.experience,
        description: updateStaffDto.description,
        room: updateStaffDto.room,
        role: updateStaffDto.role,
        user: {
          update: {
            ...data,
          },
        },
      },
    });
    return updateUser;
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      const deletedEmployee = await prisma.staff.delete({
        where: { id },
        select: { userId: true },
      });
      await prisma.user.delete({
        where: { id: deletedEmployee.userId },
      });
    });
  }
}
