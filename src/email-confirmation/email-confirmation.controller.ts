import { Controller, Get, Param } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get(':tokenId')
  async confirm(@Param('id') id: string) {
    const isEmailConfirmed = await this.emailConfirmationService.checkToken(id);

    if (!isEmailConfirmed) {
      return;
    }
    return { url: process.env.CLIENT_ADDRESS };
  }
}
