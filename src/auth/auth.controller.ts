import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    if (signInDto.role === 'Customer') {
      return this.authService.signInCustomer(
        signInDto.email,
        signInDto.password,
      );
    }
    return this.authService.signInStaff(signInDto.email, signInDto.password);
  }
}
