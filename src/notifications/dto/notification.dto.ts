export class NotificationRequestDto {
  sender: string;
  receiversId: string[];
  type: 'Info' | 'Warning' | 'Error';
  message: string;
  isRead: boolean;
  date: Date;
}

export class NotificationResponseDto extends NotificationRequestDto {
  _id: string;
}
