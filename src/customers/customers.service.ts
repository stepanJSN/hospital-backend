import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { id } = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        birthday: new Date(createCustomerDto.birthday),
      },
    });
    return id;
  }

  findAll() {
    return this.prisma.customer.findMany();
  }

  findOneById(id: string) {
    return this.prisma.customer.findUnique({
      where: {
        id,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.customer.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const data = { ...updateCustomerDto };
    if (updateCustomerDto.birthday) {
      data.birthday = new Date(updateCustomerDto.birthday);
    } else {
      delete data.birthday;
    }

    const updateUser = await this.prisma.customer.update({
      where: {
        id,
      },
      data,
    });
    return updateUser;
  }

  async remove(id: string) {
    await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
