import UserSubscriptionType from "../../domain/entities/UserSubscription.js";

export default async (
  userId,
  planId,
  paymentIntent,
  { createNewPlanRepository, subscriptionPlanRepository, paymentGateway }
) => {
  console.log(
    createNewPlanRepository,
    subscriptionPlanRepository,
    userId,
    planId
  );
  if (!createNewPlanRepository || !subscriptionPlanRepository) {
    throw new Error("Missing  repository");
  }

  const paymentVerified = await paymentGateway.retrievePaymentIntent(
    paymentIntent
  );

  if (paymentVerified) {
    const { plan_id, user_id } = paymentVerified.metadata;
    const latestSubscription = await createNewPlanRepository.latestPlan(user_id);

    const planDetail = await subscriptionPlanRepository.findById(plan_id);
    const { name, sessionLimit, duration, ads, live, uhd } = planDetail;


    const now = new Date();
    const startDate = latestSubscription && latestSubscription.endDate > now
    ? latestSubscription.endDate
    : now;

    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    const userSubscription = new UserSubscriptionType({
      userId,
      sessionLimit: sessionLimit,
      status: startDate > now ? 'queued' : 'active',
      ads,
      live,
      uhd,
      endDate,
      startDate,
      plan: name,
    });

    const res = await createNewPlanRepository.persist(userSubscription);
    return res;
  }
};
