import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { FindAllStaffDto } from './dto/find-all-staff.dto';
import { AvatarsService } from 'src/avatars/avatar.service';

@Injectable()
export class StaffService {
  constructor(
    private prisma: PrismaService,
    private readonly avatarsService: AvatarsService,
  ) {}

  private parseBirthday(birthday?: string) {
    return birthday && new Date(birthday);
  }

  private async hashPassword(password?: string) {
    return password && (await hash(password));
  }

  async create(createStaffDto: CreateStaffDto) {
    const user = await this.findOneByEmail(createStaffDto.email);

    if (user) {
      throw new BadRequestException('Staff member already exists');
    }

    const hashedPassword = await this.hashPassword(createStaffDto.password);
    const birthday = this.parseBirthday(createStaffDto.birthday);

    const { id } = await this.prisma.staff.create({
      data: {
        user: {
          create: {
            ...createStaffDto,
            isEmailVerified: true,
            password: hashedPassword,
            birthday: birthday,
          },
        },
      },
    });
    return id;
  }

  async findAll({
    name,
    surname,
    specializationId,
    page,
    take,
  }: FindAllStaffDto) {
    const conditions = {
      user: {
        name: {
          startsWith: name || '',
        },
        surname: {
          startsWith: surname || '',
        },
        specializationId,
      },
    };

    const [staff, totalCount] = await this.prisma.$transaction([
      this.prisma.staff.findMany({
        where: conditions,
        select: {
          id: true,
          user: {
            select: {
              name: true,
              surname: true,
              gender: true,
            },
          },
          experience: true,
          specialization: {
            select: {
              title: true,
            },
          },
        },
        skip: (page - 1) * take,
        take: take,
      }),
      this.prisma.staff.count({ where: conditions }),
    ]);

    return {
      data: staff.map((staffMember) => ({
        ...staffMember.user,
        id: staffMember.id,
      })),
      pagination: {
        page,
        take,
        total: totalCount,
      },
    };
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
    const data = {
      ...updateStaffDto,
      birthday: this.parseBirthday(updateStaffDto.birthday),
      password: await this.hashPassword(updateStaffDto.password),
    };

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
    const staffMember = await this.prisma.staff.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!staffMember) {
      throw new BadRequestException('Staff member not found');
    }

    await this.avatarsService.deleteByUserId(id);
    await this.prisma.$transaction(async (prisma) => {
      await prisma.staff.delete({ where: { id } });
      await prisma.user.delete({ where: { id: staffMember.userId } });
    });
  }
}
