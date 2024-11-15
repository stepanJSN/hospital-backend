import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindAllCustomerDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNumberString()
  take?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;
}
