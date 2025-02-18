import UserSubscriptionType from "../../domain/entities/UserSubscription.js";

export default async ( { userPlanRepository }) => {
  if (!userPlanRepository) {
    throw new Error("Missing  repository");
  }

  const planCount = await userPlanRepository.SubscriptionCount();

  //console.log("Plan Details",planDetail[0])
  return planCount
};
