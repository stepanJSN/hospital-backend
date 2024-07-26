import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/signIn.dto';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInRequestDto,
  ) {
    if (signInDto.role === 'Customer') {
      return this.authService.signInCustomer(
        response,
        signInDto.email,
        signInDto.password,
      );
    }
    return this.authService.signInStaff(
      response,
      signInDto.email,
      signInDto.password,
    );
  }

  @Public()
  @Post('access-token')
  async getNewTokens(@Req() req: Request) {
    const refreshTokenFromCookies = req.cookies['refreshToken'];

    if (!refreshTokenFromCookies) {
      throw new UnauthorizedException('Refresh token not passed');
    }

    return this.authService.getNewAccessToken(refreshTokenFromCookies);
  }

  @Public()
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }
}
