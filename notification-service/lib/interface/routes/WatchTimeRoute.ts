import express from "express";
import WatchTimeController from "../controller/WatchTimeController";
import ActiveUsersController from "../controller/ActiveUsersController";

const router = express.Router();
const activeUsersController = new ActiveUsersController();

router.get("/heatmap" ,activeUsersController.getActiveUsers);
router.get("/", WatchTimeController.getWatchTime);

export default router;
