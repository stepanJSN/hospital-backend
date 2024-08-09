import { Injectable } from '@nestjs/common';
import {
  NotificationRequestDto,
  NotificationResponseDto,
} from './dto/notification.dto';
import { PubSubService } from 'src/pub-sub/pub-sub.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly httpService: HttpService,
  ) {}

  create(NotificationDto: NotificationRequestDto) {
    this.pubSubService.writeMessages(JSON.stringify(NotificationDto));
  }

  async findAll(
    receiverId: string,
    onlyUnread: boolean,
  ): Promise<NotificationResponseDto[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<NotificationResponseDto[]>(
          `${process.env.NOTIFICATION_SERVICE}/${receiverId}`,
          {
            params: {
              onlyUnread,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  markAsRead(messageId: string) {
    return this.httpService
      .patch(`${process.env.NOTIFICATION_SERVICE}/${messageId}`)
      .pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw error;
        }),
      );
  }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}
