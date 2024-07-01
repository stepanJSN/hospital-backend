import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
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

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsIn(['Admin', 'Staff'])
  role: 'Admin' | 'Staff';

  @IsOptional()
  @IsString()
  specializationId?: string;

  @IsNumber()
  experience?: number;

  schedule: Array<{
    dayOfWeek: number;
    startTime: number;
    endTime: number;
  }>;
}
