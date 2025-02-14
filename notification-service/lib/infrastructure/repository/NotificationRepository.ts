import NotificationModel from "../database/models/NotificationSchema";

class NotificationRepositoryImpl implements NotificationRepositoryImpl {
  async create(notificationData: object): Promise<any> {
    return await NotificationModel.create(notificationData);
  }

  async getAllByRecipient(recipientId: string): Promise<any[]> {
    return await NotificationModel.find({
      recipient: recipientId,
    }).sort({ createdAt: -1 });
    // return await NotificationModel.find({
    //   $or: [
    //     { recipient: null },
    //     { recipient: recipientId }
    //   ],
    // }).sort({ createdAt: -1 });
  }
}

export default NotificationRepositoryImpl;
