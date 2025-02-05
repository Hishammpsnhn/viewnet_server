import { Request, Response } from "express";
import { GetLatestSeries } from "../../../use-case/getLastestMovies";
import { MovieMetadataRepository } from "../../../infrastructure/repositories/VideoMetadataRepository";
import { MovieCatalogRepository } from "../../../infrastructure/repositories/MovieCatalog";
import WatchHistoryRepository from "../../../infrastructure/repositories/WatchHistoryRepository";
import { GetMovieCatalog } from "../../../use-case/getMovieCatalog";
import { GetMovieMeta } from "../../../use-case/getMovieMeta";

const movieCatalogRepository = new MovieCatalogRepository();
const movieMetaRepository = new MovieMetadataRepository();
const watchHistoryRepository = new WatchHistoryRepository();
const latestSeriesUseCase = new GetLatestSeries(movieMetaRepository);
const getMovieMeta = new GetMovieMeta(movieMetaRepository);
const getMovieCatalogUseCase = new GetMovieCatalog(
  movieCatalogRepository,
  movieMetaRepository,
  watchHistoryRepository
);

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
    const { id, profileId } = req.query;
    
    if (!id || typeof id !== "string") {
      throw new Error("Invalid id");
    }
    try {
      const data = await getMovieCatalogUseCase.execute(
        id,
        profileId as string | undefined
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
  async getMovieMeta(req: Request, res: Response): Promise<void> {
    console.log("request meta of movie", req.params.id);
    const { id } = req.params;
    try {
      const data = await getMovieMeta.execute(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
}
