import { Request, Response } from "express";
import { GetLatestSeries } from "../../../use-case/getLastestMovies";
import { MovieMetadataRepository } from "../../../infrastructure/repositories/VideoMetadataRepository";
import { MovieCatalogRepository } from "../../../infrastructure/repositories/MovieCatalog";
import { GetMovieCatalog } from "../../../use-case/getMovieCatalog";
import { GetMovieMeta } from "../../../use-case/getMovieMeta";

const latestSeriesUseCase = new GetLatestSeries(new MovieMetadataRepository());
const getMovieCatalogUseCase = new GetMovieCatalog(
  new MovieCatalogRepository()
);
const getMovieMeta = new GetMovieMeta(new MovieMetadataRepository());

export class MovieController {
  async latestMovies(req: Request, res: Response): Promise<void> {
    try {
      const data = await latestSeriesUseCase.execute();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
  async getMovieCatalog(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const data = await getMovieCatalogUseCase.execute(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
  async getMovieMeta(req: Request, res: Response): Promise<void> {
    console.log("haiidi")
    const { id } = req.params;
    try {
      const data = await getMovieMeta.execute(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
}
