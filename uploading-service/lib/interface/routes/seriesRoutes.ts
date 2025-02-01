
import express from "express";
import { SeriesController } from "../controller/series/SeriesController";
import { SeasonController } from "../controller/series/SeasonController";
import { EpisodeController } from "../controller/series/EpisodeController";

const router = express.Router();

const seriesController = new SeriesController();
const seasonController = new SeasonController();
const episodeController = new EpisodeController();

// Series Routes
router.post("/series", seriesController.createSeries); //using

// router.get("/series", seriesController.getAllSeries);
router.get("/series/:id", seriesController.getSeriesById); //using
router.put("/series/:id", seriesController.updateSeries);
// router.delete("/series/:id", seriesController.deleteSeries);

// Season Routes
router.post("/seasons/:seriesId", seasonController.createSeason);//using


// Episode Routes
router.post("/episode/generateSignedUrl",episodeController.generateSignedUrl);


export default router;
