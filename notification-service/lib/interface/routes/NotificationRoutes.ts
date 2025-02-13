import express from "express";
import { NotificationController } from "../controller/NotificationController";
const notification = new NotificationController()

const router = express.Router();
console.log("router")

router.get("/:id", (req, res) => notification.getNotification(req, res));


//episode

export default router;