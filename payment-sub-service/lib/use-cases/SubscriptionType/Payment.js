import UserSubscriptionType from "../../domain/entities/UserSubscription.js";

export default async function (
  planId,
  userId,
  { subscriptionPlanRepository, paymentGateway, createNewPlanRepository }
) {
  const plan = await subscriptionPlanRepository.findById(planId);
  if (!plan) throw new Error("No subscription plans in this Id");

  const paymentResult = await paymentGateway.processPayment({
    amount: plan.price,
    currency: "usd",
    userId,
    planId,
  });
  if (!paymentResult) {
    throw new Error("Payment failed: " + paymentResult.error);
  }
  // const { planId, userId } = paymentVerified.metadata;
  const latestSubscription = await createNewPlanRepository.latestPlan(userId);

  const planDetail = await subscriptionPlanRepository.findById(planId);
  const { name, sessionLimit, duration, ads, live, uhd } = planDetail;

  const now = new Date();
  const startDate =
    latestSubscription && latestSubscription.endDate > now
      ? latestSubscription.endDate
      : now;

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration);

  const userSubscription = new UserSubscriptionType({
    userId,
    sessionLimit: sessionLimit,
    status: startDate > now ? "queued" : "active",
    ads,
    live,
    uhd,
    endDate,
    startDate,
    plan: name,
  });
  const res = await createNewPlanRepository.persist(userSubscription);
  console.log("res after crate new user subsciption",res);

  return paymentResult;
}
