import mongoose from "mongoose";
import UserSubscriptionType from "../../../domain/entities/UserSubscription.js";
import IUserSubscriptionPlanRepository from "../../../domain/interfaces/IUserSubscription.js";
import MongooseUserSubscriptionPlan from "../../database/models/UserSubscriptionModel.js";

export default class UserSubscriptionPlanRepository extends IUserSubscriptionPlanRepository {
  // Implement the persist method
  async persist(subscriptionEntity) {
    const mongooseUserSubscription = new MongooseUserSubscriptionPlan({
      userId: subscriptionEntity.userId,
      plan: subscriptionEntity.plan,
      sessionLimit: subscriptionEntity.sessionLimit,
      uhd: subscriptionEntity.uhd,
      live: subscriptionEntity.live,
      ads: subscriptionEntity.ads,
      status: subscriptionEntity.status,
      startDate: subscriptionEntity.startDate,
      endDate: subscriptionEntity.endDate,
    });
    await mongooseUserSubscription.save();
    console.log(mongooseUserSubscription);

    return mapToUserSubscriptionEntity(mongooseUserSubscription);
  }

  async findById(subscriptionId) {
    const mongooseUserSubscription =
      await MongooseUserSubscriptionPlan.findById(subscriptionId);
    return mapToUserSubscriptionEntity(mongooseUserSubscription);
  }
  async findByUserId(userId) {
    userId = userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId format");
    }

    const mongooseUserSubscriptions =
      await MongooseUserSubscriptionPlan.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $addFields: {
            sortOrder: {
              $cond: [
                { $eq: ["$status", "active"] },
                0,
                { $cond: [{ $eq: ["$status", "queue"] }, 1, 2] },
              ],
            },
          },
        },
        {
          $sort: {
            sortOrder: 1,
          },
        },
      ]);
    return mongooseUserSubscriptions.map(mapToUserSubscriptionEntity);
  }
  async latestPlan(userId) {
    const data = await MongooseUserSubscriptionPlan.findOne({ userId }).sort({
      endDate: -1,
    });
    return mapToUserSubscriptionEntity(data);
  }
  async findActiveSubscriptions() {
    return MongooseUserSubscriptionPlan.find({ status: "active" });
  }

  async findQueuedSubscriptions() {
    return MongooseUserSubscriptionPlan.find({ status: "queued" });
  }

  async updateStatus(id, status) {
    return MongooseUserSubscriptionPlan.findByIdAndUpdate(id, { status });
  }
}

function mapToUserSubscriptionEntity(mongooseUserSubscription) {
  if (!mongooseUserSubscription) {
    return null;
  }

  const subscription = new UserSubscriptionType({
    id: mongooseUserSubscription._id,
    userId: mongooseUserSubscription.userId,
    plan: mongooseUserSubscription.plan,
    sessionLimit: mongooseUserSubscription.sessionLimit,
    status: mongooseUserSubscription.status,
    endDate: mongooseUserSubscription.endDate,
    startDate: mongooseUserSubscription.startDate,
    uhd: mongooseUserSubscription.uhd,
    live: mongooseUserSubscription.live,
    ads: mongooseUserSubscription.ads,
  });
  subscription.createdAt = mongooseUserSubscription.createdAt;
  subscription.updatedAt = mongooseUserSubscription.updatedAt;
  return subscription;
}
