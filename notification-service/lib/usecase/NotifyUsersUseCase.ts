import { NotificationSender } from "../domain/interface/NotificationSender";
import { LiveStartedEvent } from "../domain/entity/LiveStartedEvent";
import NotificationRepositoryImpl from "../infrastructure/repository/NotificationRepository";
import UserGateway from "../gateway/userGateway";

export class NotifyUsersUseCase {
  private notificationSender: NotificationSender;
  private notificationRepository: NotificationRepositoryImpl;
  private userGateway: UserGateway;

  constructor(
    notificationSender: NotificationSender,
    notificationRepository: NotificationRepositoryImpl,
    userGateway: UserGateway
  ) {
    this.notificationSender = notificationSender;
    this.notificationRepository = notificationRepository;
    this.userGateway = userGateway;
  }

  async execute(eventType: string, data: any): Promise<void> {
    let notificationMessage: string;

    switch (eventType) {
      case "movie_uploaded":
        notificationMessage = `New movie uploaded: ${data.title}`;
        break;

      case "plan_purchased":
        notificationMessage = `Thank you for your purchase! We truly appreciate your support and look forward to serving you.`;
        break;

      case "live_started":
        const liveData = data as LiveStartedEvent;
        notificationMessage = `Live stream started: ${liveData.title}`;
        break;

      default:
        notificationMessage = "Unknown event received.";
    }

    if (eventType === "movie_uploaded") {
      try {
        const users = await this.userGateway.fetchUser(); 
        if (users && users.data && users.data.length > 0) {

          // Send notification to all users
          for (const user of users.data) {
            const userId = user.id || user._id; 
            const userEmail = user.email;

            console.log(
              `Sending notification to User ID: ${userId}, Email: ${userEmail}`
            );

            // Save notification in the repository
            await this.notificationRepository.create({
              message: notificationMessage,
              recipient: userId,
            });

            // Send the notification via the notification sender
            await this.notificationSender.sendNotification(
              userId,
              notificationMessage
            );
          }
        } else {
          console.error("No users found to send notifications.");
        }
      } catch (error) {
        console.error("Error while notifying users:", error);
      }
    } else {
      this.notificationRepository.create({
        message: notificationMessage,
        recipient: data.userId ? data.userId : null,
      });

      this.notificationSender.sendNotification(
        data.userId || null,
        notificationMessage
      );
    }
  }
}
