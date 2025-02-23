import express from "express";
import {
  CreateSubscriptionPlan,
  EditPlan,
  GetAllPlans,
  Plan_Payment,
} from "../controller/SubscriptionTypeControllers/SubscriptionTypeController.js";
import {
  GetUserPlan,
  GetUserPlanCount,
  
} from "../controller/userSubscription/UserSubscriptionController.js";
import webhookController from "../controller/webhookController.js";
import transactionController from "../controller/transactionController.js";

const router = express.Router();

router.get("/", GetAllPlans);
router.get("/:userId/plans", GetUserPlan);
router.get("/pie_chart", GetUserPlanCount);
router.get("/:userId/active", GetUserPlan);
router.get("/transactions", transactionController.getAllTransactions);
router.get("/transactions", transactionController.getAllTransactions);
router.put("/:id", EditPlan);
router.post("/payment", Plan_Payment);
router.post("/", CreateSubscriptionPlan);
router.post("/webhook", express.raw({ type: 'application/json' }),webhookController.handleStripeWebhook);


export default router;
