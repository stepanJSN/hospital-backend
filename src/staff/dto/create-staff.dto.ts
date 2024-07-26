import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
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
  birthday: Date;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsIn(['Admin', 'Staff'])
  role: 'Admin' | 'Staff';

  @IsOptional()
  @IsString()
  specializationId?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;
}
