import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { messageTemplate } from 'src/notifications/notifications.config';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { replacePlaceholders } from 'src/utils/replacePlaceholders';

@Injectable()
export class ResetPasswordService {
  constructor(
    private jwtService: JwtService,
    private notification: NotificationsService,
    private prisma: PrismaService,
  ) {}

  async generateToken(email: string) {
    this.notification.sendMail({
      message: replacePlaceholders(messageTemplate.resetPassword, {
        token: await this.jwtService.signAsync({ email }),
      }),
      to: email,
      subject: 'Reset password',
    });
  }

  async updatePassword(token: string, newPassword: string) {
    try {
      const { email } = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.resetPassword,
      });

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password: newPassword,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
