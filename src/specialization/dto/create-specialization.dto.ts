import { IsString } from 'class-validator';

export class CreateSpecializationDto {
  @IsString()
  title: string;
}
