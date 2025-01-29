import UserSubscriptionType from "../../domain/entities/UserSubscription.js";

export default async (userId, { userPlanRepository }) => {
  if (!userPlanRepository) {
    throw new Error("Missing  repository");
  }

  const planDetail = await userPlanRepository.findByUserId(userId);

  console.log("Plan Details",planDetail)
  return planDetail
};
