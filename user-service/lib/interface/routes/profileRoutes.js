import express from "express";
import { isAuthenticated } from "../controllers/AuthMiddleware.js";
import ProfileController from "../controllers/ProfileController.js";

const router = express.Router();

const profileController = new ProfileController();

router.post(
  "/profile/:id",
  isAuthenticated,
  profileController.changeDefaultProfile
);
router.put("/profile/:id", isAuthenticated, profileController.updateProfile);
router.post("/profile", isAuthenticated, profileController.createProfile);

export default router;
