import { IsEmail, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  telephone: string;

  @IsString()
  password: string;

  @IsString()
  birthday: Date;
}
