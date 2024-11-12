import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    const payload = { id: user.id, email: user.email, role: user.role };
    return await this.jwtService.signAsync(payload);
  }

  private async generateAndSetRefreshToken(
    response: Response,
    user: JWTPayload,
  ) {
    const payload = { id: user.id, email: user.email, role: user.role };
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
    if (!user) throw new UnauthorizedException('Invalid login or password');

    const isValid = await verify(user.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid login or password');

    const access_token = await this.generateAccessToken({
      id: user.id,
      email,
      role: 'Customer',
    });

    await this.generateAndSetRefreshToken(response, {
      id: user.id,
      email,
      role: 'Customer',
    });

    return {
      access_token,
      role: 'Customer',
      id: user.id,
    };
  }

  async signInStaff(
    response: Response,
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const user = await this.staffService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid login or password');

    const isValid = await verify(user.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid login or password');

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
