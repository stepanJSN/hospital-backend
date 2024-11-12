import { Controller, Get, Param, Res } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { Response } from 'express';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get(':tokenId')
  async confirm(@Param('tokenId') tokenId: string, @Res() res: Response) {
    const isEmailConfirmed =
      await this.emailConfirmationService.checkToken(tokenId);

    if (!isEmailConfirmed) {
      return;
    }
    res.redirect(process.env.CLIENT_ADDRESS);
  }
}
