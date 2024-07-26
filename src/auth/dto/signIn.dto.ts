import { Role } from '@prisma/client';
import { IsEmail, IsIn, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  email: string;
  @IsIn(['Staff', 'Customer'])
  role: 'Staff' | 'Customer';
  @IsString()
  password: string;
}

export class SignInResponseDto {
  access_token: string;
  role: Role;
  id: string;
}
