import UserSubscriptionType from "../../domain/entities/UserSubscription.js";

export default async (userId, { userPlanRepository }) => {
  if (!userPlanRepository) {
    throw new Error("Missing  repository");
  }

  const planDetail = await userPlanRepository.findActiveSubscriptions(userId);

  console.log("Plan Details",planDetail[0])
  return planDetail
};
