import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class FindAllAppointmentsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(['false', 'true'])
  isCompleted?: 'false' | 'true';
}
