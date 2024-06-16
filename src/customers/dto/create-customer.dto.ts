import { IsDate, IsEmail, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  @Min(3)
  @Max(15)
  name: string;

  @IsString()
  @Min(3)
  @Max(15)
  surname: string;

  @IsInt()
  telephone: number;

  @IsString()
  password: string;

  @IsDate()
  birthday: Date;
}
