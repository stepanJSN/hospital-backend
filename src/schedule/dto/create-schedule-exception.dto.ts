import { IsDateString, IsUUID } from 'class-validator';

export class CreateScheduleExceptionDto {
  @IsUUID()
  userId: string;

  @IsDateString()
  date: string;
}
