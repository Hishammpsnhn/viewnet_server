import NotificationRepositoryImpl from "../infrastructure/repository/NotificationRepository";

class GetNotificationsUseCase {
  private notificationRepository: NotificationRepositoryImpl;

  constructor(notificationRepository: NotificationRepositoryImpl) {
    this.notificationRepository = notificationRepository;
  }

  async execute(recipientId: string): Promise<boolean> {
    if (!recipientId) {
      throw new Error("Recipient ID is required.");
    }

     await this.notificationRepository.deleteNotification(recipientId);
    return true;
  }
}

export default GetNotificationsUseCase;
