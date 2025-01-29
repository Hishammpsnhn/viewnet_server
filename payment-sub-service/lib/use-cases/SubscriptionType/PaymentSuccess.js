export default async function (
  planId,
  userId,
  { subscriptionPlanRepository, userSubscriptionPlanRepository ,}
) {
  if (!subscriptionPlanRepository || !userSubscriptionPlanRepository) {
    throw new Error(
      "Missing required dependency: subscriptionPlanRepository or userSubscriptionPlanRepository"
    );
  }
  const plan = await subscriptionPlanRepository.findById(planId);
  if (!plan) throw new Error("No subscription plans in this Id");
  const userSubscription = await userSubscriptionPlanRepository.findByUserId(
    userId
  );
  if (userSubscription) {
    throw new Error("User already has a subscription");
  }else{
    const newUserSubscription = await userSubscriptionPlanRepository.create(
      userId,
      plan
    );
    return newUserSubscription;
  }
}
