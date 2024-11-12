import { Role } from '@prisma/client';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  email: string;
  @IsIn(['Staff', 'Customer'])
  role: 'Staff' | 'Customer';
  @IsString()
  @MinLength(8)
  password: string;
}

export class SignInResponseDto {
  access_token: string;
  role: Role | 'Customer';
  id: string;
}
