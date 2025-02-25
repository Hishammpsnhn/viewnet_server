import express from "express";
import { isAuthenticated } from "../controllers/AuthMiddleware.js";
import ProfileController from "../controllers/ProfileController.js";

const router = express.Router();

const profileController = new ProfileController();

router.post(
  "/:id",
  profileController.changeDefaultProfile
);
router.put("/:id", profileController.updateProfile);
router.post("/", profileController.createProfile);

export default router;
