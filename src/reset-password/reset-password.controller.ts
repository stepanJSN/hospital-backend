import { Body, Controller, Post } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  async reset(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.resetPasswordService.generateToken(resetPasswordDto.email);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('new-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    await this.resetPasswordService.updatePassword(
      updatePasswordDto.token,
      updatePasswordDto.password,
    );
    return { message: 'Password updated successfully' };
  }
}
