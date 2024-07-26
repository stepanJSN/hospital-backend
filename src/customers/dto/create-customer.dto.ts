import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  @Length(12)
  telephone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsDateString()
  birthday: Date;
}
