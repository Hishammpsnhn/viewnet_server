interface INotificationRepository {
    create(notificationData: object): Promise<any>;
    getAllByRecipient(recipientId: string): Promise<any[]>;
    // delete(id: string): Promise<any>;
  }
  