import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateToken(userId: string) {
    return await this.jwtService.signAsync({ id: userId });
  }

  async checkToken(token: string) {
    const emailSecret = this.configService.get<string>('JWT_EMAIL');
    try {
      const { id } = await this.jwtService.verifyAsync(token, {
        secret: emailSecret,
      });
      await this.confirmEmail(id);
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  private async confirmEmail(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isEmailVerified: true,
      },
    });
  }
}
