import { Request, Response } from "express";
import { GetLatestSeries } from "../../../use-case/getLastestMovies";
import { MovieMetadataRepository } from "../../../infrastructure/repositories/VideoMetadataRepository";
import { MovieCatalogRepository } from "../../../infrastructure/repositories/MovieCatalog";
import { SeriesRepository } from "../../../infrastructure/repositories/series/SeriesRepository";
import WatchHistoryRepository from "../../../infrastructure/repositories/WatchHistoryRepository";
import { GetMovieCatalog } from "../../../use-case/getMovieCatalog";
import { GetRecommendedMoviesUseCase } from "../../../use-case/RecommedMovies";
import { GetMovieMeta } from "../../../use-case/getMovieMeta";
import { GetSearchQuery } from "../../../use-case/searchQuery";
import { HttpStatus } from "../../HttpStatus";

const movieCatalogRepository = new MovieCatalogRepository();
const movieMetaRepository = new MovieMetadataRepository();
const watchHistoryRepository = new WatchHistoryRepository();
const seriesRepository = new SeriesRepository();

const latestSeriesUseCase = new GetLatestSeries(movieMetaRepository);
const getMovieMeta = new GetMovieMeta(movieMetaRepository);
const getQuery = new GetSearchQuery(movieMetaRepository, seriesRepository);
const getRecommendedMovie = new GetRecommendedMoviesUseCase(
  watchHistoryRepository,
  movieMetaRepository
);
const getMovieCatalogUseCase = new GetMovieCatalog(
  movieCatalogRepository,
  movieMetaRepository,
  watchHistoryRepository
);

export class MovieController {
  async latestMovies(req: Request, res: Response): Promise<void> {
    const {page,limit} = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    try {
      const data = await latestSeriesUseCase.execute(pageNum,limitNum);
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
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
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
  async getMovieMeta(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const data = await getMovieMeta.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
  async recommendedMovies(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const recommendedMovies = await getRecommendedMovie.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data: recommendedMovies });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
  async searchQuery(req: Request, res: Response): Promise<void> {
    const query = req.query.q || "";
    try {
      const recommendedMovies = await getQuery.execute(query as string);
      res.status(HttpStatus.OK).json({ success: true, data: recommendedMovies });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
}
