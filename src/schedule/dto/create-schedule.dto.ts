import { IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  staffId: string;

  schedule: Array<{
    dayOfWeek: number;
    startTime: number | null;
    endTime: number | null;
  }>;
}
