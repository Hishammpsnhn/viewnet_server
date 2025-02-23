import express from "express";
import * as LiveStreamController from "../../interface/controller/liveStreamingController";

const router = express.Router();

router.post("/", LiveStreamController.createLiveStream);
router.get("/stream-details/:id", LiveStreamController.getLiveStreamDetails);
router.get("/list/active", LiveStreamController.listActiveStreams);
router.get("/assets", LiveStreamController.getAssets);
router.get("/assets-details/:assetsId", LiveStreamController.getAssetDetails);
router.get("/list/all", LiveStreamController.listAllStreams);
router.post("/stop-stream", LiveStreamController.stopLiveStream);
// router.post("/webhook", LiveStreamController.liveStreamMetrics);
router.delete(
  "/remove-stream/:streamId",
  LiveStreamController.removeLiveStream
);

export default router;
