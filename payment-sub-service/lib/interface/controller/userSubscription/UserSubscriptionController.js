import CreateNewUserSubscription from "../../../use-cases/userSubscription/CreateNewUserSubscription.js";
import GetUserPlanDetail from "../../../use-cases/userSubscription/GetUserPlan.js";
import UserNewPlanRepository from "../../../infrastructure/repository/userSubscription/userSubsciption.js";
import SubscriptionPlanRepository from "../../../infrastructure/repository/subscriptionPlan/subscriptionPlanRepository.js";
import paymentGateway from "../../../infrastructure/Stripe/paymentGateway.js";

const userPlanRepository = new UserNewPlanRepository();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const PaymentGateway = new paymentGateway();
export async function UserCreatePlan(req, res) {
  console.log(req.body);
  const { userId, planId ,paymentIntent} = req.body;
  try {
    const userPlan = await CreateNewUserSubscription(userId, planId,paymentIntent, {
      createNewPlanRepository: userPlanRepository,
      subscriptionPlanRepository: subscriptionPlanRepository,
      paymentGateway: PaymentGateway,

    });
    res.status(200).json({ message: true, userPlan });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}
export async function GetUserPlan(req, res) {
  const {userId} = req.params;
  console.log(userId);
  
  try {
    const userPlan = await GetUserPlanDetail(userId, {
      userPlanRepository: userPlanRepository,
    });
    res.status(200).json({ success: true, userPlan });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}
