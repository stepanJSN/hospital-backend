import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarsService } from './avatar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAvatarDto } from './dto/create-avatar.dto';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({
            fileType: /(image\/(jpeg|png|avif|webp|jpg))/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createAvatarDto: CreateAvatarDto,
  ) {
    return await this.avatarsService.upload(image, createAvatarDto.userId);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return await this.avatarsService.deleteByUserId(userId);
  }
}
