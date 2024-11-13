import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import { Role } from '@prisma/client';
import { hash } from 'argon2';

type FindAllWhere = {
  role?: {
    not: Role;
  };
  name?: {
    startsWith: string;
  };
  surname?: {
    startsWith: string;
  };
  specializationId?: string;
  specialization?: {
    isNot: null;
  };
  schedule?: {
    some: {
      dayOfWeek: {
        equals: number;
      };
    };
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

  // findAll(
  //   role: Role,
  //   specializationId?: string,
  //   date?: string,
  //   surname?: string,
  //   name?: string,
  // ) {
  //   const where = () => {
  //     const whereRes: FindAllWhere = {};
  //     if (role !== Role.Admin) {
  //       whereRes.role = {
  //         not: Role.Admin,
  //       };
  //       whereRes.specialization = {
  //         isNot: null,
  //       };
  //     }
  //     if (specializationId) {
  //       whereRes.specializationId = specializationId;
  //     }
  //     if (date) {
  //       whereRes.schedule = {
  //         some: {
  //           dayOfWeek: {
  //             equals: new Date(date).getDay(),
  //           },
  //         },
  //       };
  //     }
  //     if (surname) {
  //       whereRes.surname = {
  //         startsWith: surname,
  //       };
  //     }
  //     if (name) {
  //       whereRes.name = {
  //         startsWith: name,
  //       };
  //     }
  //     return whereRes;
  //   };

  //   const select = {
  //     id: true,
  //     name: true,
  //     surname: true,
  //     experience: true,
  //     gender: true,
  //     specialization: {
  //       select: {
  //         title: true,
  //       },
  //     },
  //   };

  //   return this.prisma.staff.findMany({
  //     where: where(),
  //     select: select,
  //   });
  // }

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

  // async getAvailableTime(staffId: string, startDate: string, endDate: string) {
  //   const startDateParsed = new Date(startDate);
  //   const endDateParsed = new Date(endDate);
  //   const dataDB = await this.prisma.staff.findUnique({
  //     where: {
  //       id: staffId,
  //     },
  //     select: {
  //       schedule: true,
  //       appointments: {
  //         where: {
  //           dateTime: {
  //             gte: startDateParsed,
  //             lte: endDateParsed,
  //           },
  //         },
  //       },
  //     },
  //   });
  //   const result = [];

  //   for (
  //     let index = new Date(startDateParsed);
  //     index < endDateParsed;
  //     index.setDate(index.getDate() + 1)
  //   ) {
  //     const day = dataDB.schedule.find(
  //       (element) =>
  //         element.dayOfWeek === index.getDay() && element.startTime !== null,
  //     );
  //     if (day) {
  //       const oneDay = {
  //         dayOfWeek: new Date(index),
  //         startTime: day.startTime,
  //         endTime: day.endTime,
  //         bookedTime: [],
  //       };
  //       for (let i = day.startTime; i < day.endTime; i++) {
  //         if (
  //           dataDB.appointments.find((element) => {
  //             const appointmentDate = dayjs(element.dateTime);
  //             return (
  //               appointmentDate.get('hours') === i &&
  //               appointmentDate.get('day') === index.getDay()
  //             );
  //           })
  //         ) {
  //           oneDay.bookedTime.push(i);
  //         }
  //       }
  //       result.push(oneDay);
  //     } else {
  //       result.push({ dayOfWeek: new Date(index) });
  //     }
  //   }

  //   return result;
  // }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
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
