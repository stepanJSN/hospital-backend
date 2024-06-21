import { IsEmail, IsIn, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;
  @IsIn(['Staff', 'Customer'])
  role: 'Staff' | 'Customer';
  @IsString()
  password: string;
}
