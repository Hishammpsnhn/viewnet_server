import { Router } from "express";
import { GenreController } from "../controller/genreController";


const router = Router();
const genreController = new GenreController();


router.get("/", (req, res) => genreController.getAllGenre(req, res));
router.post("/", (req, res) => genreController.createGenre(req, res));


export default router;
