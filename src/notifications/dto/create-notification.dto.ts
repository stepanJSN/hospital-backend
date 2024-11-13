export class CreateNotificationDto {
  senderId: string;
  receiverId: string;
  type: 'Info' | 'Warning' | 'Error';
  message: string;
  isRead: boolean;
}
