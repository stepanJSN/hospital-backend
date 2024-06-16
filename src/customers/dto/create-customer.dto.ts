import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsInt()
  telephone: number;

  @IsString()
  password: string;

  @IsString()
  birthday: Date;
}
