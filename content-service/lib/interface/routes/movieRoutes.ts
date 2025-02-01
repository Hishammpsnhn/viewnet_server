import express from "express";
import {MovieController } from "../controller/movies/MovieController";

const router = express.Router();
const movieController = new MovieController();

//series
router.get("/", (req, res) => movieController.latestSeries(req, res));


//episode

export default router;
