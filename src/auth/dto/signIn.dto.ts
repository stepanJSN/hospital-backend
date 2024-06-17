import { IsEmail, IsIn, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;
  @IsIn(['staff', 'customer'])
  role: 'staff' | 'customer';
  @IsString()
  password: string;
}
