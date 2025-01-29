// infrastructure/queue/NotificationService.js
import sendNotificationToQueue from "./setup.js";
import INotificationService from "../../domain/interfaces/INotificationService.js";

class NotificationService extends INotificationService {
  async sendNotification(email, subject, message) {
    await sendNotificationToQueue(email, subject, message);
  }
}

export default NotificationService;
