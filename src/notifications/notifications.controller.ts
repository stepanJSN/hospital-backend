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
import { FindAllNotificationsDto } from './dto/find-all-notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get(':id')
  async findAll(
    @Param('id') id: string,
    @Query() findAllNotificationsDto: FindAllNotificationsDto,
  ) {
    return await this.notificationsService.findAll({
      receiverId: id,
      isRead: findAllNotificationsDto.isRead,
      page: +findAllNotificationsDto.page,
      take: +findAllNotificationsDto.take,
    });
  }

  @Patch(':id')
  async markAsRead(@Param('id') notificationId: string) {
    await this.notificationsService.markAsRead(notificationId);
    return 'Notification marked as read';
  }

  @Delete(':id')
  async remove(@Param('id') notificationId: string) {
    await this.notificationsService.remove(notificationId);
    return 'Notification deleted successfully';
  }
}
