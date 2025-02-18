import { Request, Response } from "express";
import NotificationRepositoryImpl from "../../infrastructure/repository/NotificationRepository";
import GetNotificationsUseCase from "../../usecase/NotificationUseCase";
import GetNotificationsCountUseCase from "../../usecase/GetNotificationCountUsecase";
import DeleteNotificationUseCase from "../../usecase/DeleteNotificationUseCase";
import { HttpStatus } from "../HttpStatus";


export class NotificationController {
  private getNotificationsUseCase: GetNotificationsUseCase;
  private getNotificationsCountUseCase:GetNotificationsCountUseCase
  private deleteNotificationUseCase: DeleteNotificationUseCase;

  constructor() {
    const notificationRepository = new NotificationRepositoryImpl();
    this.getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
    this.getNotificationsCountUseCase = new GetNotificationsCountUseCase(notificationRepository);
    this.deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepository);
  }

  async getNotification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // Validate input
      if (!id) {
        res.status(HttpStatus.NotFound).json({ success: false, message: "Profile ID is required." });
        return;
      }

      // Use case to fetch notifications
      const notifications = await this.getNotificationsUseCase.execute(id as string);

      // Return response
      res.status(HttpStatus.OK).json({ success: true, data: notifications });
    } catch (error: any) {
      console.error(`Error fetching notifications for profileId: ${id}`, error);
      res.status(HttpStatus.InternalServerError).json({ success: false, message: "Failed to fetch notifications", error: error.message });
    }
  }
  async getNotificationCount(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // Validate input
      if (!id) {
        res.status(HttpStatus.NotFound).json({ success: false, message: "Profile ID is required." });
        return;
      }

      const notifications = await this.getNotificationsCountUseCase.execute(id as string);

      res.status(HttpStatus.OK).json({ success: true, data: notifications });
    } catch (error: any) {
      console.error(`Error fetching notifications count for profileId: ${id}`, error);
      res.status(HttpStatus.InternalServerError).json({ success: false, message: "Failed to fetch notifications count", error: error.message });
    }
  }
  async deleteNotification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(HttpStatus.NotFound).json({ success: false, message: "Profile ID is required." });
        return;
      }

      const notifications = await this.deleteNotificationUseCase.execute(id as string);

      res.status(HttpStatus.OK).json({ success: true, data: notifications });
    } catch (error: any) {
      console.error(`Error fetching notifications count for profileId: ${id}`, error);
      res.status(HttpStatus.InternalServerError).json({ success: false, message: "Failed to fetch notifications count", error: error.message });
    }
  }
}
