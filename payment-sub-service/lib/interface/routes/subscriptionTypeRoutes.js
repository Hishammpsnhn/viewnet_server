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
import transactionController from "../controller/transactionController.js";

const endpointSecret = environment.STRIPE_WEBHOOK_KEY;
const stripe = new Stripe(environment.STRIPE_SECRET_KEY);
const router = express.Router();

router.get("/", GetAllPlans);
router.get("/:userId/plans", GetUserPlan);
router.get("/:userId/active", GetUserPlan);
router.get("/transactions", transactionController.getAllTransactions);
router.put("/:id", EditPlan);
router.post("/payment", Plan_Payment);
// router.post("/payment-success", UserCreatePlan);
router.post("/", CreateSubscriptionPlan);
router.post("/webhook", webhookController.handleStripeWebhook);


export default router;
