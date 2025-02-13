import { NotificationSender } from "../domain/interface/NotificationSender";
import {  LiveStartedEvent } from "../domain/entity/LiveStartedEvent";
import NotificationRepositoryImpl from "../infrastructure/repository/NotificationRepository";

export class NotifyUsersUseCase {
  private notificationSender: NotificationSender;
  private notificationRepository: NotificationRepositoryImpl;
  constructor(notificationSender: NotificationSender,notificationRepository: NotificationRepositoryImpl) {
    this.notificationSender = notificationSender;
    this.notificationRepository = notificationRepository;
  }

  execute(eventType: string, data: any): void {
    let notificationMessage: string;

    switch (eventType) {
      // case "movie_uploaded":
      //   const movieData = data as MovieUploadedEvent;
      //   notificationMessage = `New movie uploaded: ${movieData.title}`;
      //   break;

      case "plan_purchased":
        const planData = data ;
        notificationMessage = `New plan purchased by user: ${planData.userId}`;
        break;

      case "live_started":
        const liveData = data as LiveStartedEvent;
        notificationMessage = `Live stream started: ${liveData.title}`;
        break;

      default:
        notificationMessage = "Unknown event received.";
    }
    this.notificationRepository.create({
      message: notificationMessage,
      recipient: data.userId?data.userId : null

    })
    this.notificationSender.sendNotification(eventType, notificationMessage);
  }
}
