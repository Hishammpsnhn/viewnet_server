import { Request, Response } from "express";
import NotificationRepositoryImpl from "../../infrastructure/repository/NotificationRepository";
import GetNotificationsUseCase from "../../usecase/NotificationUseCase";


export class NotificationController {
  private getNotificationsUseCase: GetNotificationsUseCase;

  constructor() {
    const notificationRepository = new NotificationRepositoryImpl();
    this.getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
  }

  async getNotification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log("get notification", id);
    try {
      // Validate input
      if (!id) {
        res.status(400).json({ success: false, message: "Profile ID is required." });
        return;
      }

      // Use case to fetch notifications
      const notifications = await this.getNotificationsUseCase.execute(id as string);

      // Return response
      res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      console.error(`Error fetching notifications for profileId: ${id}`, error);
      res.status(500).json({ success: false, message: "Failed to fetch notifications", error: error.message });
    }
  }
}
