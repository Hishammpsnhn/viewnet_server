import { Request, Response } from "express";
import WatchLaterSeriesRepository from "../../infrastructure/repositories/WatchLaterSeriesRepository";
import GetWatchLaterUseCase from "../../use-case/watch-later/getSeriesWatchLater";
import RemoveWatchLaterUseCase from "../../use-case/watch-later/removeWatchLaterSeries";
import AddWatchLaterUseCase from "../../use-case/watch-later/addSeriesWatchLater";
import { HttpStatus } from "../HttpStatus";

const getWatchLaterUseCase = new GetWatchLaterUseCase(
  new WatchLaterSeriesRepository()
);
const removeWatchLaterUseCase = new RemoveWatchLaterUseCase(
  new WatchLaterSeriesRepository()
);
const addWatchLaterUseCase = new AddWatchLaterUseCase(
  new WatchLaterSeriesRepository()
);

export class WatchLaterSeriesController {
  // Update progress
  async AddMovie(req: Request, res: Response): Promise<void> {
    const { profileId, catalogId } = req.body;
    try {
      await addWatchLaterUseCase.execute(
        profileId as string,
        catalogId as string
      );
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: any) {
      console.error(
        `Error fetching watch history for profileId: ${profileId}`,
        error
      );
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  async getWatchLater(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    console.log("calling get watch later ",id)

    try {
      const movies = await getWatchLaterUseCase.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data: movies });
    } catch (error: any) {
      console.error(
        `Error fetching watch history for profileId: ${id}`,
        error
      );
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }
  async removeMovie(req: Request, res: Response): Promise<void> {
    const { profileId, catalogId } = req.query;

    try {
      await removeWatchLaterUseCase.execute(
        profileId as string,
        catalogId as string
      );
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: any) {
      console.error(
        `Error fetching watch history for profileId: ${profileId}`,
        error
      );
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }
}
