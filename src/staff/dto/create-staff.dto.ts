import {
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStaffDto {
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

  @IsOptional()
  @IsString()
  specializationId?: string;

  @IsNumber()
  experience?: number;
}
