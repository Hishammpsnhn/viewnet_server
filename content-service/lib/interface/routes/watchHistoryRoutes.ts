import express, { Response,Request } from "express";
import { WatchHistoryController } from "../controller/WatchHistoryController";

const router = express.Router();
const watchHistoryController = new WatchHistoryController();

// Route for getting watch history
router.get("/", (req, res) => watchHistoryController.getWatchHistory(req, res));
router.get("/continue", (req, res) => watchHistoryController.continueWatch(req, res));

// Route for updating watch progress
router.post("/", (req, res) => watchHistoryController.updateProgress(req, res));

// Export the router
export default router;
