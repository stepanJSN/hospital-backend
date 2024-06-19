/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async signInCustomer(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.customerService.findOneByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { uid: user.id, email: user.email, role: 'User' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // async signInStaff(email: string, pass: string): Promise<any> {
  //   const user = await this.customerService.findOneByEmail(email);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //   const { password, ...result } = user;
  //   // TODO: Generate a JWT and return it here
  //   // instead of the user object
  //   return result;
  // }
}
