import { Request, Response } from "express";
import { GetLatestSeries } from "../../../use-case/getLatestSeries";
import { SeriesRepository } from "../../../infrastructure/repositories/series/SeriesRepository";
import { GetSeriesDetails } from "../../../use-case/getSeriesDetails";
import { GetEpisodeDetails } from "../../../use-case/episodeDetails";
import { EpisodeRepository } from "../../../infrastructure/repositories/series/EpisodeRepository";
import { GetEpisodeCatalogDetails } from "../../../use-case/getEpisodeCatalog";

const latestSeriesUseCase = new GetLatestSeries(new SeriesRepository());
const seriesDetailsUseCase = new GetSeriesDetails(new SeriesRepository());
const episodeCatalogDetailsUseCase = new GetEpisodeCatalogDetails(
  new EpisodeRepository()
);
const episodeDetailsUseCase = new GetEpisodeDetails(new EpisodeRepository());

export class SeriesController {
  async latestSeries(req: Request, res: Response): Promise<void> {
    try {
      const series = await latestSeriesUseCase.execute();
      res.status(200).json({ success: true, data: series });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
  async seriesDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("seriesDetails", id);
      const series = await seriesDetailsUseCase.execute(id);
      res.status(200).json({ success: true, data: series });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
  async episodeDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("seriesDetails", id);
      const series = await episodeDetailsUseCase.execute(id);
      res.status(200).json({ success: true, data: series });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
  async episodeCatalogDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("dfd", id);
      const series = await episodeCatalogDetailsUseCase.execute(id);
      res.status(200).json({ success: true, data: series });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
}
