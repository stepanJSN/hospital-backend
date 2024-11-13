import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string, @Query('isRead') isRead?: string) {
    const parsedParams = isRead ? !!isRead : true;
    return this.notificationsService.findAll(id, parsedParams);
  }

  @Patch(':id')
  markAsRead(@Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId);
  }

  @Delete(':id')
  remove(@Param('id') notificationId: string) {
    return this.notificationsService.remove(notificationId);
  }
}
