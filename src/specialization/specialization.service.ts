import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Injectable()
export class SpecializationService {
  constructor(private prisma: PrismaService) {}

  async create(createSpecializationDto: CreateSpecializationDto) {
    const specialization = await this.prisma.specialization.create({
      data: createSpecializationDto,
    });
    return specialization;
  }

  async findAllByTitle(title: string, page = 1, take = 10) {
    const conditions = title
      ? {
          where: {
            title: {
              contains: title,
              mode: 'insensitive',
            },
          },
        }
      : null;
    const specializations = await this.prisma.specialization.findMany({
      ...conditions,
      skip: (page - 1) * take,
      take,
    });

    const totalCount = await this.prisma.specialization.count({
      ...conditions,
    });

    return {
      data: specializations,
      pagination: {
        page,
        take,
        total: totalCount,
      },
    };
  }

  private async isSpecializationExist(id: string) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
    });
    if (!specialization) {
      throw new NotFoundException(`Specialization with ID ${id} not found`);
    }
    return true;
  }

  update(id: string, updateSpecializationDto: UpdateSpecializationDto) {
    if (this.isSpecializationExist(id)) {
      return this.prisma.specialization.update({
        where: {
          id,
        },
        data: updateSpecializationDto,
      });
    }
  }

  remove(id: string) {
    if (this.isSpecializationExist(id)) {
      return this.prisma.specialization.delete({
        where: {
          id,
        },
      });
    }
  }
}
