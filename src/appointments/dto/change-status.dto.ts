import { IsBoolean } from 'class-validator';

export class ChangeStatusDto {
  @IsBoolean()
  isCompleted: boolean;
}
