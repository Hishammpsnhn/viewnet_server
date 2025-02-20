import express from "express";
import { VideoMetadataController } from "../controller/videoMetadataController";
import { VideoController } from "../controller/videoController";

const router = express.Router();

router.get("/", VideoMetadataController.getAllMetadata);
router.get("/latest-movies", VideoMetadataController.getAllMetadata);
router.put('/:id',VideoController.updateVideoMetadataUseCase);
router.get("/:id",VideoMetadataController.getMetadata);
router.post("/", VideoMetadataController.createMetadata);
router.post('/generate-presigned-url',VideoController.generatePresignedUrl);
router.post('/:id/update-thumbnail',VideoController.updateThumbnail);

export default router;
