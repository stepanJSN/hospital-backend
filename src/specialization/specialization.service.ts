import { Injectable } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpecializationService {
  constructor(private prisma: PrismaService) {}

  async create(createSpecializationDto: CreateSpecializationDto) {
    const specialization = await this.prisma.specialization.create({
      data: createSpecializationDto,
    });
    return specialization;
  }

  findAllByTitle(title: string) {
    if (!title) {
      return this.prisma.specialization.findMany();
    }
    return this.prisma.specialization.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });
  }

  update(id: string, updateSpecializationDto: UpdateSpecializationDto) {
    return this.prisma.specialization.update({
      where: {
        id,
      },
      data: updateSpecializationDto,
    });
  }

  remove(id: string) {
    return this.prisma.specialization.delete({
      where: {
        id,
      },
    });
  }
}
