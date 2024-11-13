import { IsDateString, IsUUID } from 'class-validator';

export class CreateScheduleExceptionDto {
  @IsUUID()
  staffId: string;

  @IsDateString()
  date: string;
}
