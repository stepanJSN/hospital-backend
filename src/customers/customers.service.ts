import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const user = await this.findOneByEmail(createCustomerDto.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const { id } = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        password: await hash(createCustomerDto.password),
        birthday: new Date(createCustomerDto.birthday),
      },
    });
    return id;
  }

  findAll(name?: string, surname?: string) {
    return this.prisma.customer.findMany({
      where: {
        name: {
          startsWith: name,
        },
        surname: {
          startsWith: surname,
        },
      },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
        avatarUrl: true,
      },
    });
  }

  findOneById(id: string) {
    return this.prisma.customer.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
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
        password: true,
      },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const data = { ...updateCustomerDto };
    if (updateCustomerDto.birthday) {
      data.birthday = new Date(updateCustomerDto.birthday);
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
