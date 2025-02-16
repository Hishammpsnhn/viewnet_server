import express from "express";
import { NotificationController } from "../controller/NotificationController";
const notification = new NotificationController()

const router = express.Router();
router.get("/:id", (req, res) => notification.getNotification(req, res));
router.get("/count/:id", (req, res) => notification.getNotificationCount(req, res));
router.delete("/:id", (req, res) => notification.deleteNotification(req, res));


//episode

export default router;