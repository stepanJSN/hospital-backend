import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { CustomersService } from 'src/customers/customers.service';
import { StaffService } from 'src/staff/staff.service';
import { JWTPayload } from './types/auth.type';
import { verify } from 'argon2';
import { SignInResponseDto } from './dto/signIn.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  private async generateAccessToken(user: JWTPayload): Promise<string> {
    const payload = { uid: user.id, email: user.email, role: user.role };
    return await this.jwtService.signAsync(payload);
  }

  private async generateAndSetRefreshToken(
    response: Response,
    user: JWTPayload,
  ) {
    const payload = { uid: user.id, email: user.email, role: user.role };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 3);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  async getNewAccessToken(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const accessToken = await this.generateAccessToken(result);

    return accessToken;
  }

  async signInCustomer(
    response: Response,
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const user = await this.customerService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const access_token = await this.generateAccessToken({
      ...user,
      role: Role.Customer,
    });

    await this.generateAndSetRefreshToken(response, {
      ...user,
      role: Role.Customer,
    });

    return {
      access_token,
      role: Role.Customer,
      id: user.id,
    };
  }

  async signInStaff(
    response: Response,
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const user = await this.staffService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const access_token = await this.generateAccessToken(user);

    await this.generateAndSetRefreshToken(response, user);

    return {
      access_token,
      role: user.role,
      id: user.id,
    };
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(0),
    });
  }
}
