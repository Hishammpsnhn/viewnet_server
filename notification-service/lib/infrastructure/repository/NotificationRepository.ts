import NotificationModel from "../database/models/NotificationSchema";

class NotificationRepositoryImpl implements NotificationRepositoryImpl {
  async create(notificationData: object): Promise<any> {
    return await NotificationModel.create(notificationData);
  }

  async getAllByRecipient(recipientId: string): Promise<any[]> {
    const res = await NotificationModel.find({
      recipient: recipientId,
    }).sort({ createdAt: -1 });

    await NotificationModel.updateMany({ recipient: recipientId }, { isRead: true });
    return res;
  }
  async getCountByRecipient(recipientId: string): Promise<Number> {
    const res = await NotificationModel.countDocuments({
      recipient: recipientId,
      isRead: false,
    })

    return res;
  }
  async deleteNotification(recipientId: string): Promise<boolean> {
    const res = await NotificationModel.deleteMany({
      recipient: recipientId,
    })
    console.log(res)

    return true;
  }
}

export default NotificationRepositoryImpl;
