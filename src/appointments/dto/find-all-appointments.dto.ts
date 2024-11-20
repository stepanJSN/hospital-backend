import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
export class FindAllAppointmentsDto {
  @IsString()
  userId: string;

  @IsIn(['staff', 'customer'])
  returnType: 'staff' | 'customer';

  @IsOptional()
  fromDate?: string;

  @IsOptional()
  toDate?: string;

  @IsOptional()
  @IsIn(['false', 'true'])
  isCompleted?: 'false' | 'true';

  @IsOptional()
  @IsString()
  staffName?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Min(1)
  @Max(50)
  take?: number;
}
