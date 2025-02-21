import Stripe from "stripe";
import environment from "../../infrastructure/config/environment.js";
import CreateNewUserSubscription from "../../use-cases/userSubscription/CreateNewUserSubscription.js";
import UserNewPlanRepository from "../../infrastructure/repository/userSubscription/userSubscription.js";
import SubscriptionPlanRepository from "../../infrastructure/repository/subscriptionPlan/subscriptionPlanRepository.js";
import LiveProducer from "../../infrastructure/queue/LiveStreamProducer.js";
import TransactionRepository from "../../infrastructure/repository/Transaction/TransactionHistory.js";
import CreateTransactionUseCase from "../../use-cases/Transaction/createTransaction.js";

const paymentStatus = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
};

const liveProducer = new LiveProducer();
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

    const session = event.data.object;
    let status = paymentStatus.pending;

    if (event.type === "checkout.session.completed") {
      status = paymentStatus.completed;
    } else if (
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "invoice.payment_failed"
    ) {
      status = paymentStatus.failed;
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      status = paymentStatus.pending;
    }

    if (
      event.type.startsWith("checkout.session") ||
      event.type.startsWith("invoice.payment")
    ) {
      const userId = session.metadata?.userId || "N/A";
      const planId = session.metadata?.planId || "N/A";
      const planName = session.metadata?.planName || "N/A";
      const planPrice = session.metadata?.planPrice || "N/A";
      const email = session.metadata?.email || "N/A";
      const transactionId = session.metadata?.transactionId || "N/A";

      console.log("✅ Transaction Status:", status);

      liveProducer.sendLiveNotification({ userId, planName, planPrice });

      await CreateNewUserSubscription(userId, planId, {
        createNewPlanRepository: userPlanRepository,
        subscriptionPlanRepository: subscriptionPlanRepository,
      });

      await createTransactionUseCase.execute({
        transactionId,
        userId,
        status,
        planId,
        amount: planPrice,
        email,
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(401).send(`Webhook Error: ${err.message}`);
  }
};

export default { handleStripeWebhook };
