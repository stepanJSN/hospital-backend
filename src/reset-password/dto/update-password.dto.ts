import { IsJWT, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsJWT()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}
