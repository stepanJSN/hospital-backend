import { IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  staffId: string;

  data: Array<{
    dayOfWeek: number;
    startTime: number;
    endTime: number;
  }>;
}
