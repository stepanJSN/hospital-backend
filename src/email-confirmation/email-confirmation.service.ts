import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateToken(userId: string) {
    return await this.jwtService.signAsync({ id: userId });
  }

  async checkToken(token: string) {
    try {
      const { id } = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.email,
      });
      this.confirmEmail(id);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
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
