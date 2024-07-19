export class UpdateScheduleDto {
  id: string;
  dayOfWeek: number;
  startTime: number | null;
  endTime: number | null;
}
