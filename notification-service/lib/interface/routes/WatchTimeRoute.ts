import express from "express";
import WatchTimeController from "../controller/WatchTimeController";

const router = express.Router();

router.get("/", WatchTimeController.getWatchTime);

export default router;
