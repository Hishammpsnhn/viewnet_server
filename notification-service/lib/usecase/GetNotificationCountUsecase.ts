import NotificationRepositoryImpl from "../infrastructure/repository/NotificationRepository";

class GetNotificationsUseCase {
  private notificationRepository: NotificationRepositoryImpl;

  constructor(notificationRepository: NotificationRepositoryImpl) {
    this.notificationRepository = notificationRepository;
  }

  async execute(recipientId: string): Promise<Number> {
    if (!recipientId) {
      throw new Error("Recipient ID is required.");
    }

    const notifications = await this.notificationRepository.getCountByRecipient(recipientId);
    return notifications;
  }
}

export default GetNotificationsUseCase;
