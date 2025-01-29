export default async function ({ subscriptionPlanRepository }) {
  const plans = subscriptionPlanRepository.find();
  if (!plans) throw new Error("No subscription plans");
  return plans;
}
