import { IsUUID } from 'class-validator';

export class CreateAvatarDto {
  @IsUUID()
  userId: string;
}
