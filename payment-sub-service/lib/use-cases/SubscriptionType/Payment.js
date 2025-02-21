

export default async function (
  planId,
  userId,
  email,
  { subscriptionPlanRepository, paymentGateway, createNewPlanRepository }
) {
  const plan = await subscriptionPlanRepository.findById(planId);
  if (!plan) throw new Error("No subscription plans in this Id");

  const paymentVerified = await paymentGateway.productGateway(userId,plan,email);
  return paymentVerified

}
