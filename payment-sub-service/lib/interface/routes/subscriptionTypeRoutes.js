import express from "express";
import {
  CreateSubscriptionPlan,
  EditPlan,
  GetAllPlans,
  Plan_Payment,
} from "../controller/SubscriptionTypeControllers/SubscriptionTypeController.js";
import { GetUserPlan, UserCreatePlan } from "../controller/userSubscription/UserSubscriptionController.js";

const router = express.Router();

router.get("/", GetAllPlans);
router.get("/:userId/plans", GetUserPlan);
router.put("/:id", EditPlan);
router.post("/", CreateSubscriptionPlan);
router.post("/payment-success", UserCreatePlan);
router.post("/payment", Plan_Payment);

export default router;
