import { Request, Response } from "express";
import WatchLaterRepository from "../../infrastructure/repositories/WatchLaterMoviesRepository";
import GetWatchLaterUseCase from "../../use-case/watch-later/getWatchLaterMovies";
import RemoveWatchLaterUseCase from "../../use-case/watch-later/removeWatchLaterMovie";
import AddWatchLaterUseCase from "../../use-case/watch-later/addWatchLaterMovies";
import { HttpStatus } from "../HttpStatus";

const getWatchLaterUseCase = new GetWatchLaterUseCase(
  new WatchLaterRepository()
);
const removeWatchLaterUseCase = new RemoveWatchLaterUseCase(
  new WatchLaterRepository()
);
const addWatchLaterUseCase = new AddWatchLaterUseCase(
  new WatchLaterRepository()
);

export class WatchLaterController {
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

    try {
      const movies = await getWatchLaterUseCase.execute(id as string);
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
