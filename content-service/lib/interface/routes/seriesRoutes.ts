import express from "express";
import { SeriesController } from "../controller/series/SeriesController";
import { WatchLaterSeriesController } from "../controller/WatchLaterSeries";

const router = express.Router();
const seriesController = new SeriesController();
const watchLaterSeriesController = new WatchLaterSeriesController()


//series
router.get("/", (req, res) => seriesController.latestSeries(req, res));
router.get("/:id", (req, res) => seriesController.seriesDetails(req, res));
router.get("/episode/:id", (req, res) => seriesController.episodeDetails(req, res));
router.get("/episode/catalog/:id", (req, res) => seriesController.episodeCatalogDetails(req, res));



//watch later
router.get("/watch-later/:id", (req, res) => watchLaterSeriesController.getWatchLater(req, res));
router.post("/watch-later", (req, res) => watchLaterSeriesController.AddMovie(req, res));
router.delete("/watch-later", (req, res) => watchLaterSeriesController.removeMovie(req, res));

//episode

export default router;
