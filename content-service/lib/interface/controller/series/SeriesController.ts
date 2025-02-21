import { Request, Response } from "express";
import { GetLatestSeries } from "../../../use-case/getLatestSeries";
import { SeriesRepository } from "../../../infrastructure/repositories/series/SeriesRepository";
import { GetSeriesDetails } from "../../../use-case/getSeriesDetails";
import { GetEpisodeDetails } from "../../../use-case/episodeDetails";
import { EpisodeRepository } from "../../../infrastructure/repositories/series/EpisodeRepository";
import { GetEpisodeCatalogDetails } from "../../../use-case/getEpisodeCatalog";
import WatchHistoryRepository from "../../../infrastructure/repositories/WatchHistoryRepository";
import { HttpStatus } from "../../HttpStatus";

const latestSeriesUseCase = new GetLatestSeries(new SeriesRepository());
const seriesDetailsUseCase = new GetSeriesDetails(new SeriesRepository());
const episodeCatalogDetailsUseCase = new GetEpisodeCatalogDetails(
  new EpisodeRepository(),
  new WatchHistoryRepository()
);
const episodeDetailsUseCase = new GetEpisodeDetails(
  new EpisodeRepository(),
  new WatchHistoryRepository()
);

export class SeriesController {
  async latestSeries(req: Request, res: Response): Promise<void> {
    try {
      const series = await latestSeriesUseCase.execute();
      res.status(HttpStatus.OK).json({ success: true, data: series });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
  async seriesDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const profileId = req.query.profileId as string;
      const series = await seriesDetailsUseCase.execute(id, profileId);
      res.status(HttpStatus.OK).json({ success: true, data: series });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
  async episodeDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const profileId = req.query.profileId as string;
      const series = await episodeDetailsUseCase.execute(id, profileId);
      res.status(HttpStatus.OK).json({ success: true, data: series });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
  async episodeCatalogDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const profileId = req.query.profileId as string;
      const series = await episodeCatalogDetailsUseCase.execute(id, profileId);
      res.status(HttpStatus.OK).json({ success: true, data: series });
    } catch (error) {
      res.status(HttpStatus.InternalServerError).json({ message: "Error fetching latest series", error });
    }
  }
}
