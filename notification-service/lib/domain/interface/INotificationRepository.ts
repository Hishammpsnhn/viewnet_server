interface INotificationRepository {
    create(notificationData: object): Promise<any>;
    getAllByRecipient(recipientId: string): Promise<any[]>;
    getCountByRecipient(recipientId: string): Promise<Number>;
    // delete(id: string): Promise<any>;
  }
  