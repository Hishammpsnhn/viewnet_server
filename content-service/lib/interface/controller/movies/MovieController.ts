import { Request, Response } from "express";
import { GetLatestSeries } from "../../../use-case/getLastestMovies";
import { MovieMetadataRepository} from "../../../infrastructure/repositories/VideoMetadataRepository";

const latestSeriesUseCase = new GetLatestSeries(new MovieMetadataRepository());

export class MovieController {
  async latestSeries(req: Request, res: Response): Promise<void> {
    try {
      const data = await latestSeriesUseCase.execute();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest series", error });
    }
  }
 
}
