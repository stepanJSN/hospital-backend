import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  surname: string;

  @IsOptional()
  @IsString()
  @Length(12)
  telephone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsDateString()
  birthday: string;

  @IsEnum(Gender)
  gender: Gender;
}
