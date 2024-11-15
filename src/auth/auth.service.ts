import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from 'src/customers/customers.service';
import { StaffService } from 'src/staff/staff.service';
import { JWTPayload } from './types/auth.type';
import { verify } from 'argon2';
import { SignInRequestDto, SignInResponseDto } from './dto/signIn.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  private async generateToken(
    payload: JWTPayload,
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  private async generateAndSetToken(
    response: Response,
    payload: JWTPayload,
    expiresIn: string,
  ) {
    const token = await this.generateToken(payload, expiresIn);
    const expiresInDate = new Date();
    expiresInDate.setDate(expiresInDate.getDate() + 3);

    response.cookie('refreshToken', token, {
      httpOnly: true,
      expires: expiresInDate,
      secure: true,
      sameSite: 'none',
    });
  }

  private async validateUserCredentials(
    email: string,
    password: string,
    role: 'Customer' | 'Staff',
  ) {
    let user;
    if (role === 'Customer') {
      user = await this.customerService.findOneByEmail(email);
    } else {
      user = await this.staffService.findOneByEmail(email);
    }

    if (!user) throw new UnauthorizedException('Invalid login or password');
    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Email is not verified. Please verify your email to continue.',
      );
    }

    const isValid = await verify(user.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid login or password');

    return user;
  }

  async getNewAccessToken(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');
    return await this.generateToken(result, '30m');
  }

  signIn(
    response: Response,
    signInDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return signInDto.role === 'Customer'
      ? this.signInCustomer(response, signInDto.email, signInDto.password)
      : this.signInStaff(response, signInDto.email, signInDto.password);
  }

  async signInCustomer(
    response: Response,
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const user = await this.validateUserCredentials(
      email,
      password,
      'Customer',
    );

    const access_token = await this.generateToken(
      { id: user.id, email, role: 'Customer' },
      '30m',
    );
    await this.generateAndSetToken(
      response,
      { id: user.id, email, role: 'Customer' },
      '3d',
    );

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
    const user = await this.validateUserCredentials(email, password, 'Staff');

    const tokenPayload = { id: user.id, role: user.staff[0].role, email };
    const access_token = await this.generateToken(tokenPayload, '30m');
    await this.generateAndSetToken(response, tokenPayload, '3d');

    return {
      access_token,
      role: user.staff[0].role,
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
