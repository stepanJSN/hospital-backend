import { Controller, Get, Param, Query, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
//import { CreateNotificationDto } from './dto/notification.dto';
//import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post()
  // create(@Body() createNotificationDto: CreateNotificationDto) {
  //   return this.notificationsService.create(createNotificationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.notificationsService.findAll();
  // }

  @Get(':id')
  findAllMessagesByUserId(
    @Param('id') id: string,
    @Query() params: { onlyUnread?: string },
  ) {
    const parsedParams = params.onlyUnread
      ? JSON.parse(params.onlyUnread)
      : true;
    return this.notificationsService.findAll(id, parsedParams);
  }

  @Patch(':id')
  markAsRead(@Param('id') messageId: string) {
    return this.notificationsService.markAsRead(messageId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationsService.remove(+id);
  // }
}
