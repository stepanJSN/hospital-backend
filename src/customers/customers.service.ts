import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { NotificationsService } from 'src/notifications/notifications.service';
import { messageTemplate } from 'src/notifications/notifications.config';
import { replacePlaceholders } from 'src/utils/replacePlaceholders';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationsService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const user = await this.findOneByEmail(createCustomerDto.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const { userId, id } = await this.prisma.customer.create({
      data: {
        user: {
          create: {
            ...createCustomerDto,
            password: await hash(createCustomerDto.password),
            birthday: new Date(createCustomerDto.birthday),
          },
        },
      },
    });

    this.notification.sendMail({
      message: replacePlaceholders(messageTemplate.confirmEmail, {
        token: await this.emailConfirmationService.generateToken(userId),
      }),
      to: createCustomerDto.email,
      subject: 'Email confirmation',
    });

    return id;
  }

  async findAll(name?: string, surname?: string) {
    const customers = await this.prisma.customer.findMany({
      where: {
        user: {
          name: {
            startsWith: name,
          },
          surname: {
            startsWith: surname,
          },
        },
      },
      include: {
        user: {
          omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return customers.map((customer) => ({
      ...customer.user,
      id: customer.id,
    }));
  }

  async findOneById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });
    return { ...customer.user, id: customer.id };
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        customer: true,
      },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const data = { ...updateCustomerDto };
    if (updateCustomerDto.birthday) {
      data.birthday = new Date(updateCustomerDto.birthday);
    }

    const updatedCustomer = await this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        user: {
          update: {
            ...data,
          },
        },
      },
    });
    return updatedCustomer;
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      const deletedCustomer = await prisma.customer.delete({
        where: { id },
        select: { userId: true },
      });
      await prisma.user.delete({
        where: { id: deletedCustomer.userId },
      });
    });
  }
}
