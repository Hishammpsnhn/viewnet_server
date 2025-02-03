import express from "express";
import { SeriesController } from "../controller/series/SeriesController";

const router = express.Router();
const seriesController = new SeriesController();

//series
router.get("/", (req, res) => seriesController.latestSeries(req, res));
router.get("/:id", (req, res) => seriesController.seriesDetails(req, res));
router.get("/episode/:id", (req, res) => seriesController.episodeDetails(req, res));
router.get("/episode/catalog/:id", (req, res) => seriesController.episodeCatalogDetails(req, res));


//episode

export default router;
