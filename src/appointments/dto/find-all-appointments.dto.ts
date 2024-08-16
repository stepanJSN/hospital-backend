import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class FindAllAppointmentsDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsIn(['staff', 'customer'])
  returnType: 'staff' | 'customer';

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsIn(['false', 'true'])
  isCompleted?: 'false' | 'true';

  @IsOptional()
  @IsString()
  staffName: string;

  @IsOptional()
  @IsString()
  customerName: string;
}
