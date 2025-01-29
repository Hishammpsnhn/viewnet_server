import CreateNewSubPlan from "../../../use-cases/SubscriptionType/CreateNewSubPlan.js";
import GetPlans from "../../../use-cases/SubscriptionType/GetPlans.js";
import EditPlans from "../../../use-cases/SubscriptionType/EditPlans.js";
import NewUserPlan from "../../../use-cases/userSubscription/CreateNewUserSubscription.js";
import SubscriptionPlanRepository from "../../../infrastructure/repository/subscriptionPlan/subscriptionPlanRepository.js";
import Payment from "../../../use-cases/SubscriptionType/Payment.js";
import PaymentGateway from "../../../infrastructure/Stripe/paymentGateway.js";
import UserNewPlanRepository from "../../../infrastructure/repository/userSubscription/userSubsciption.js";

const createNewPlanRepository = new UserNewPlanRepository();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const paymentGateway = new PaymentGateway();

export async function GetAllPlans(req, res) {
  try {
    const plans = await GetPlans({ subscriptionPlanRepository });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
export async function CreateSubscriptionPlan(req, res) {
  console.log(req.body)
  const {
    name,
    description,
    price,
    sessionLimit,
    duration,
    isActive,
    uhd,
    ads,
    live
  } = req.body;

  try {
    const plan = await CreateNewSubPlan(
      name,
      description,
      price,
      sessionLimit,
      duration,
      isActive,
      ads,
      uhd,
      live,
      {
        subscriptionPlanRepository,
      }
    );

    res.status(200).json({ success: true, plan });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

export async function EditPlan(req, res) {
  const { id } = req.params;
  try {
    const plan = await EditPlans(id, req.body, { subscriptionPlanRepository });
    res.status(200).json({ success: true, plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function Plan_Payment(req, res) {
  const { planId, userId } = req.body;
  try {
    const plan = await Payment(planId, userId, {
      subscriptionPlanRepository,
      paymentGateway,
      createNewPlanRepository
    });
    res.status(200).json({ success: true, clientSecret: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
