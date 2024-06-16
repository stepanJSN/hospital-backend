import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
// import { UpdateCustomerDto } from './dto/update-customer.dto';
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

  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} customer`;
  // }
}
