import UserSubscriptionType from "../../domain/entities/UserSubscription.js";

export default async (
  userId,
  planId,
  { createNewPlanRepository, subscriptionPlanRepository }
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
  if(!userId || !planId) {
    throw new Error("User ID and Plan ID are required");
  }

  
    const latestSubscription = await createNewPlanRepository.latestPlan(userId);

    const planDetail = await subscriptionPlanRepository.findById(planId);
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
  
};
