// src/routes/index.ts
import express from "express";
import { SeriesController } from "../controller/series/SeriesController";
import { SeasonController } from "../controller/series/SeasonController";
import { EpisodeController } from "../controller/series/EpisodeController";

const router = express.Router();

const seriesController = new SeriesController();
const seasonController = new SeasonController();
const episodeController = new EpisodeController();

// Series Routes
router.post("/series", seriesController.createSeries);
router.get("/series", seriesController.getAllSeries);
router.get("/series/:id", seriesController.getSeriesById);
router.put("/series/:id", seriesController.updateSeries);
router.delete("/series/:id", seriesController.deleteSeries);

// Season Routes
router.post("/seasons", seasonController.createSeason);
router.get("/seasons/:id", seasonController.getSeasonById);
router.get("/seasons/series/:seriesId", seasonController.getSeasonsBySeriesId);
router.put("/seasons/:id", seasonController.updateSeason);
router.delete("/seasons/:id", seasonController.deleteSeason);

// Episode Routes
router.post("/episodes", episodeController.createEpisode);
router.get("/episodes/:id", episodeController.getEpisodeById);
router.get("/episodes/season/:seasonId", episodeController.getEpisodesBySeasonId);
router.put("/episodes/:id", episodeController.updateEpisode);
router.delete("/episodes/:id", episodeController.deleteEpisode);

export default router;
