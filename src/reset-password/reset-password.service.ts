import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
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
    private configService: ConfigService,
  ) {}

  async generateToken(email: string) {
    const token = await this.jwtService.signAsync({ email });
    const message = replacePlaceholders(messageTemplate.resetPassword, {
      token,
    });

    this.notification.sendMail({
      message,
      to: email,
      subject: 'Reset password',
    });
  }

  async updatePassword(token: string, newPassword: string) {
    const resetPasswordSecret =
      this.configService.get<string>('JWT_RESET_PASSWORD');
    try {
      const { email } = await this.jwtService.verifyAsync(token, {
        secret: resetPasswordSecret,
      });
      const hashedPassword = await hash(newPassword);

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error('Error updating password:', error);
    }
  }
}
