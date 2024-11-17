import { IsBoolean, IsNumberString, IsOptional } from 'class-validator';

export class FindAllNotificationsDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  take?: string;
}
