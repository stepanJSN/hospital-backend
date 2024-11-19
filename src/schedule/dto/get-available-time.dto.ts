import { IsDateString, IsUUID } from 'class-validator';

export class GetAvailableTimeDto {
  @IsUUID()
  staffId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
