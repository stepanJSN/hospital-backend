import { IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  userId: string;
}
