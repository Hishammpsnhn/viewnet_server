import express from "express";
import Stripe from "stripe";
import {
  CreateSubscriptionPlan,
  EditPlan,
  GetAllPlans,
  Plan_Payment,
} from "../controller/SubscriptionTypeControllers/SubscriptionTypeController.js";
import {
  GetUserPlan,
} from "../controller/userSubscription/UserSubscriptionController.js";
import environment from "../../infrastructure/config/environment.js";
import webhookController from "../controller/webhookController.js";

const endpointSecret = environment.STRIPE_WEBHOOK_KEY;
const stripe = new Stripe(environment.STRIPE_SECRET_KEY);
const router = express.Router();

router.get("/", GetAllPlans);
router.get("/:userId/plans", GetUserPlan);
router.get("/:userId/active", GetUserPlan);
router.put("/:id", EditPlan);
router.post("/payment", Plan_Payment);
// router.post("/payment-success", UserCreatePlan);
router.post("/", CreateSubscriptionPlan);
router.post("/webhook", webhookController.handleStripeWebhook);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     console.log("webhook")
//     const sig = req.headers["stripe-signature"];
//     console.log("sig",sig)

//     if (!sig) {
//       return res.status(400).send("Missing Stripe signature");
//     }

//     try {
//       // Verify and parse the event
//       const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//       const eventType = event.type;
//       const data = event.data.object;

//       console.log(`Received event: ${eventType}`);

//       if (eventType === "checkout.session.completed") {
//         console.log("Checkout session completed:", data);
//         // Handle the successful payment event
//       }

//       res.json({ received: true });
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err.message);
//       return res.status(401).send(`Webhook Error: ${err.message}`);
//     }
//   }
// );

export default router;
