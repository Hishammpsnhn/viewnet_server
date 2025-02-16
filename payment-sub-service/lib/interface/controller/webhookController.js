import Stripe from "stripe";
import environment from "../../infrastructure/config/environment.js";
import CreateNewUserSubscription from "../../use-cases/userSubscription/CreateNewUserSubscription.js";
import UserNewPlanRepository from "../../infrastructure/repository/userSubscription/userSubsciption.js";
import SubscriptionPlanRepository from "../../infrastructure/repository/subscriptionPlan/subscriptionPlanRepository.js";
import paymentGateway from "../../infrastructure/Stripe/paymentGateway.js";
import LiveProducer from "../../infrastructure/queue/LiveStreamProducer.js";
import TransactionRepository from "../../infrastructure/repository/Transaction/TransactionHistory.js";
import CreateTransactionUseCase from "../../use-cases/Transaction/createTransaction.js";

const liveProducer = new LiveProducer();
// const userSubscriptionRepository = new CreateNewUserSubscription();
const stripe = new Stripe(environment.STRIPE_SECRET_KEY);
const userPlanRepository = new UserNewPlanRepository();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const transactionRepository = new TransactionRepository();
const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository
);

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  try {
    // Verify Stripe event
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      environment.STRIPE_WEBHOOK_KEY
    );

    console.log(`Received event: ${event}`,event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Extract metadata (userId, planName, planPrice)
      const userId = session.metadata?.userId || "N/A";
      const planId = session.metadata?.planId || "N/A";
      const planName = session.metadata?.planName || "N/A";
      const planPrice = session.metadata?.planPrice || "N/A";
      const email = session.metadata?.email || "N/A";

      console.log("✅ Checkout session completed:");
      console.log(`📌 User ID: ${userId}`);
      console.log(`📌 Plan ID: ${planId}`);
      console.log(`📌 Plan Price: ₹${planPrice}`);
      console.log(`📌 Email: ₹${email}`);
      liveProducer.sendLiveNotification({ userId, planName, planPrice });

      const userPlan = await CreateNewUserSubscription(userId, planId, {
        createNewPlanRepository: userPlanRepository,
        subscriptionPlanRepository: subscriptionPlanRepository,
      });

      const res = await createTransactionUseCase.execute({
        userId,
        planId,
        amount:planPrice,
        email
      });
      console.log("res",res);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(401).send(`Webhook Error: ${err.message}`);
  }
};

export default { handleStripeWebhook };
