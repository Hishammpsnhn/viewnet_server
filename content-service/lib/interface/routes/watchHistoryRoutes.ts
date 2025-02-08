import express, { Response, Request } from "express";
import { WatchHistoryController } from "../controller/WatchHistoryController";

const router = express.Router();
const watchHistoryController = new WatchHistoryController();

router.get("/", (req, res) => watchHistoryController.getWatchHistory(req, res));
router.get("/continue", (req, res) =>
  watchHistoryController.continueWatch(req, res)
);
router.post("/", (req, res) => watchHistoryController.updateProgress(req, res));
router.delete("/:profileId", (req, res) =>
  watchHistoryController.clearWatchHistory(req, res)
);

export default router;
