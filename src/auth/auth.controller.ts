import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    if (signInDto.role === 'customer') {
      return this.authService.signInCustomer(
        signInDto.email,
        signInDto.password,
      );
    }
    return;
  }
}
