import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { CustomersService } from 'src/customers/customers.service';
import { StaffService } from 'src/staff/staff.service';

type User = {
  id: string;
  email: string;
  password: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  async verifyPasswordsAndGenerateToken(
    user: User,
    passedPassword: string,
  ): Promise<{ access_token: string }> {
    if (user.password !== passedPassword) {
      throw new UnauthorizedException();
    }
    const payload = { uid: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signInCustomer(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.customerService.findOneByEmail(email);
    return this.verifyPasswordsAndGenerateToken(
      { ...user, role: Role.Customer },
      pass,
    );
  }

  async signInStaff(email: string, pass: string): Promise<any> {
    const user = await this.staffService.findOneByEmail(email);
    return this.verifyPasswordsAndGenerateToken(user, pass);
  }
}
