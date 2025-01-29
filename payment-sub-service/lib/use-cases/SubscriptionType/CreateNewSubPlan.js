import SubscriptionType from "../../domain/entities/SubscriptionType.js";

export default async (
  name,
  description,
  price,
  sessionLimit,
  duration,
  isActive,
  uhd,
  ads,
  live,
  { subscriptionPlanRepository }
) => {

  if (!subscriptionPlanRepository) {
    throw new Error("Missing required dependency: subscriptionPlanRepository");
  }

  if (!subscriptionPlanRepository.persist) {
    throw new Error(
      "Persist method is not available on subscriptionPlanRepository"
    );
  }

  if (!name || !description || !price || !sessionLimit || !duration ) {
    throw new Error("Missing required parameters");
  }

  await subscriptionPlanRepository.findByName(name)

  const subscription = new SubscriptionType(
    null,
    name,
    description,
    price,
    sessionLimit,
    duration,
    isActive,
    ads,
    live,
    uhd
  );
  return subscriptionPlanRepository.persist(subscription);
};
