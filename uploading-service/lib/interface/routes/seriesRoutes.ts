
import express from "express";
import { SeriesController } from "../controller/series/SeriesController";
import { SeasonController } from "../controller/series/SeasonController";
import { EpisodeController } from "../controller/series/EpisodeController";

const router = express.Router();

const seriesController = new SeriesController();
const seasonController = new SeasonController();
const episodeController = new EpisodeController();

// Series Routes

router.get("/series", seriesController.getAllSeries);
router.get("/series/:id", seriesController.getSeriesById); 
router.put("/series/:id", seriesController.updateSeries);

router.post("/series", seriesController.createSeries); //using
// router.delete("/series/:id", seriesController.deleteSeries);

// Season Routes
router.post("/seasons/:seriesId", seasonController.createSeason);//using


// Episode Routes
router.get("/episode/catalog/:id",episodeController.getEpisodeCatalogById);
// router.get("/episode/transcoding/:id",episodeController.transcodeEpisode);
router.post("/episode/generateSignedUrl",episodeController.generateSignedUrl);
router.post("/episode/catalog",episodeController.createEpisodeCatalog);


export default router;
