import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  staffId: string;
  @IsDateString()
  dateTime: string;
}
