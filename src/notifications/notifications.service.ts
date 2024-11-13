import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendMailParam } from './notifications.type';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  sendMail({ message, from, to, subject }: SendMailParam) {
    this.mailService.sendMail({
      from: `Hospital ${from ? '| ' + from : ''} <hospital@gmail.com>`,
      to,
      subject,
      html: message,
    });
  }

  async create(createNotificationDto: CreateNotificationDto) {
    await this.prisma.notifications.create({
      data: createNotificationDto,
    });
  }

  async findAll(receiverId: string, isRead?: boolean) {
    return await this.prisma.notifications.findMany({
      where: {
        receiverId,
        isRead,
      },
    });
  }

  async markAsRead(notificationId: string) {
    await this.prisma.notifications.updateMany({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async remove(notificationId: string) {
    await this.prisma.notifications.delete({
      where: {
        id: notificationId,
      },
    });
  }
}
