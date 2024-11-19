import { Role } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  surname: string;

  @IsOptional()
  @IsString()
  @Length(12)
  telephone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(25)
  password: string;

  @IsDateString()
  birthday: string;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsIn(['Admin', 'Staff'])
  role: Role;

  @IsOptional()
  @IsString()
  specializationId?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsInt()
  room?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
