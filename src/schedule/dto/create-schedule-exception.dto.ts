import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateScheduleExceptionDto {
  @IsUUID()
  staffId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  isDayOff?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(18)
  from?: number;

  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(18)
  to?: number;
}
