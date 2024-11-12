import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// import {
//   NotificationRequestDto,
//   NotificationResponseDto,
// } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailService: MailerService) {}

  sendMail({
    message,
    from,
    to,
    subject,
  }: {
    message: string;
    to: string;
    from?: string;
    subject: string;
  }) {
    this.mailService.sendMail({
      from: `Hospital ${from ? '| ' + from : ''} <hospital@gmail.com>`,
      to,
      subject,
      text: message,
    });
  }

  create() {}

  async findAll() {}

  async markAsRead() {}

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}
