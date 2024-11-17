import { Transform } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindAllSpecializationsDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Min(1)
  @Max(50)
  take: number;
}
