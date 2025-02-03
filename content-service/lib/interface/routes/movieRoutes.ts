import express from "express";
import {MovieController } from "../controller/movies/MovieController";

const router = express.Router();
const movieController = new MovieController();

//series
router.get("/", (req, res) => movieController.latestMovies(req, res));
router.get("/:id", (req, res) => movieController.getMovieCatalog(req, res));
router.get("/meta/:id", (req, res) => movieController.getMovieMeta(req, res));


//episode

export default router;
