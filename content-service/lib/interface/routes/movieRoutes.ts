import express from "express";
import {MovieController } from "../controller/movies/MovieController";
import { WatchLaterController } from "../controller/WatchLaterMovies";

const router = express.Router();
const movieController = new MovieController();
const watchLaterController = new WatchLaterController();
//series
router.get("/", (req, res) => movieController.latestMovies(req, res));
router.get("/catalog", (req, res) => movieController.getMovieCatalog(req, res));
router.get("/meta/:id", (req, res) => movieController.getMovieMeta(req, res));
router.get("/recommended/:id", (req, res) => movieController.recommendedMovies(req, res));
router.get("/query", (req, res) => movieController.searchQuery(req, res));

//watch later
router.get("/watch-later/:id", (req, res) => watchLaterController.getWatchLater(req, res));
router.post("/watch-later", (req, res) => watchLaterController.AddMovie(req, res));
router.delete("/watch-later", (req, res) => watchLaterController.removeMovie(req, res));


//episode

export default router;
