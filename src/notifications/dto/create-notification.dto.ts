import { IsBoolean, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  subject: string;

  @IsIn(['Info', 'Warning', 'Error'])
  type?: 'Info' | 'Warning' | 'Error';

  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  sendOnEmail?: boolean;
}
