import { IsArray, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  staffId: string;

  @IsArray()
  schedule: Array<{
    dayOfWeek: number;
    startTime: number;
    endTime: number;
  }>;
}
