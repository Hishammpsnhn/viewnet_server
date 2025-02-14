import express from "express";
import AuthController from "../controllers/AuthController.js";
import QrController from "../controllers/QrController.js";
import {
  isAuthenticated,
  isAdminAuthenticated,
} from "../controllers/AuthMiddleware.js";

const router = express.Router();

// Public Routes (No authentication required)
router.get("/test", (req, res) => {
  res.json({ message: "test is working" });
});
router.post("/login", AuthController.login);
router.post("/otpVerify", AuthController.verifyOtp);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/qr", QrController.storeQR);
router.get("/qr/:id", QrController.validateQr);
// router.get('/verify-user', QrController.validate)

// Authenticated User Routes
router.get("/qr/scan/:id", isAuthenticated, QrController.scanQr);
router.get("/me", isAuthenticated, AuthController.getMe);
router.get("/validate", isAuthenticated, AuthController.validate);
router.get("/logout/:token", isAuthenticated, AuthController.logOut);

// Admin Routes
router.get("/users", AuthController.getAllUsers);
router.patch("/:id", isAdminAuthenticated, AuthController.UpdateUser);

export default router;
