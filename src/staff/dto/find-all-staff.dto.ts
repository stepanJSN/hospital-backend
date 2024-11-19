import { Transform } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FindAllStaffDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsUUID()
  specializationId?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Min(1)
  @Max(50)
  take?: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Min(1)
  page?: number;
}
