import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UpdateScheduleDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  from: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  to: number | null;
}
