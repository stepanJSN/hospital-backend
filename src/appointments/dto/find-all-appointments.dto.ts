import { OmitType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';
export class FindAllAppointmentsDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsIn(['staff', 'customer'])
  returnType: 'staff' | 'customer';

  @IsOptional()
  fromDate?: string;

  @IsOptional()
  toDate?: string;

  @IsOptional()
  @IsIn(['false', 'true'])
  isCompleted?: 'false' | 'true';

  @IsOptional()
  @IsString()
  staffName: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}
export class FindPatientAppointmentsParams extends OmitType(
  FindAllAppointmentsDto,
  ['returnType', 'customerName'],
) {}

export class FindStaffAppointmentsParams extends OmitType(
  FindAllAppointmentsDto,
  ['returnType', 'staffName'],
) {}
