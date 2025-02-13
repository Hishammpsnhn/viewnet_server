export interface NotificationSender {
    sendNotification(eventType: string, data: any): void;
  }