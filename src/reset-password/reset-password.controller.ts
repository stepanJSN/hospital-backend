import { Body, Controller, Post } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  reset(@Body() resetPasswordDto: ResetPasswordDto) {
    this.resetPasswordService.generateToken(resetPasswordDto.email);
  }

  @Post('new-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    this.resetPasswordService.updatePassword(
      updatePasswordDto.token,
      updatePasswordDto.password,
    );
  }
}
