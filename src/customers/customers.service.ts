import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { NotificationsService } from 'src/notifications/notifications.service';
import { messageTemplate } from 'src/notifications/notifications.config';
import { replacePlaceholders } from 'src/utils/replacePlaceholders';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { FindAllCustomerDto } from './dto/find-all-customers.dto';
import { AvatarsService } from 'src/avatars/avatar.service';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationsService,
    private avatarsService: AvatarsService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  private parseBirthday(birthday?: string) {
    return birthday ? new Date(birthday) : undefined;
  }

  private async hashPassword(password?: string) {
    return password ? await hash(password) : undefined;
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const existingUser = await this.findOneByEmail(createCustomerDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(createCustomerDto.password);
    const birthday = this.parseBirthday(createCustomerDto.birthday);

    const { userId, id } = await this.prisma.customer.create({
      data: {
        user: {
          create: {
            ...createCustomerDto,
            password: hashedPassword,
            birthday: birthday,
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

  async findAll({ name, surname, page, take }: FindAllCustomerDto) {
    const conditions = {
      user: {
        name: {
          startsWith: name || '',
        },
        surname: {
          startsWith: surname || '',
        },
      },
    };

    const customers = await this.prisma.customer.findMany({
      where: conditions,
      include: {
        user: {
          omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      skip: (page - 1) * take,
      take: take,
    });

    const totalCount = await this.prisma.customer.count({ where: conditions });

    return {
      data: customers.map((customer) => ({
        ...customer.user,
        id: customer.id,
      })),
      pagination: {
        page,
        take,
        total: totalCount,
      },
    };
  }

  async findOneById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });
    return customer ? { ...customer.user, id: customer.id } : null;
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        isEmailVerified: true,
        password: true,
        customer: true,
      },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const data = {
      ...updateCustomerDto,
      birthday: this.parseBirthday(updateCustomerDto.birthday),
      password: await this.hashPassword(updateCustomerDto.password),
    };

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: {
        user: {
          update: { ...data },
        },
      },
    });
    return updatedCustomer;
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    await this.avatarsService.deleteByUserId(id);
    await this.prisma.$transaction(async (prisma) => {
      await prisma.customer.delete({ where: { id } });
      await prisma.user.delete({ where: { id: customer.userId } });
    });
  }
}
