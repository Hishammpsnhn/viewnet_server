import UpdateWatchHistoryUseCase from "../../use-case/watchHistoryUseCase";
import ContinueWatching from "../../use-case/continueWatching";
import GetWatchHistoryUseCase from "../../use-case/getWatchHistory";
import WatchHistoryRepository from "../../infrastructure/repositories/WatchHistoryRepository";
import { Request, Response } from "express";

const updateWatchHistoryUseCase = new UpdateWatchHistoryUseCase(
  new WatchHistoryRepository()
);
const continueWatchingUseCase = new ContinueWatching(
  new WatchHistoryRepository()
);
const getWatchHistoryUseCase = new GetWatchHistoryUseCase(
  new WatchHistoryRepository()
);

export class WatchHistoryController {
  // Update progress
  async updateProgress(req: Request, res: Response): Promise<void> {
    const { profileId, videoCatalogId, progress } = req.body;



    try {
      const updatedProgress = await updateWatchHistoryUseCase.execute({
        profileId,
        videoCatalogId,
        progress,
      });

      res.status(200).json({ success: true, data: updatedProgress });
    } catch (error: any) {
      console.error(
        `Error updating watch progress for profileId: ${profileId}`,
        error
      );
      res.status(400).json({ error: error.message });
    }
  }

  // Get watch history
  async getWatchHistory(req: Request, res: Response): Promise<void> {
    // Correct extraction of profileId from query parameters
    const { profileId } = req.query;

    if (!profileId || typeof profileId !== "string") {
      res
        .status(400)
        .json({ error: "profileId is required and must be a string" });
      return;
    }

    try {
      const history = await getWatchHistoryUseCase.execute(profileId);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      console.error(
        `Error fetching watch history for profileId: ${profileId}`,
        error
      );
      res.status(400).json({ error: error.message });
    }
  }

  async continueWatch(req: Request, res: Response): Promise<void> {
    const { profileId, videoCatalogId } = req.query;

    if (
      !profileId ||
      typeof profileId !== "string" ||
      typeof videoCatalogId !== "string" ||
      !videoCatalogId
    ) {
      res
        .status(400)
        .json({ error: "profileId is required and must be a string" });
      return;
    }



    try {
      const updatedProgress = await continueWatchingUseCase.execute({
        profileId,
        videoCatalogId,
      });

      res.status(200).json({ success: true, data: updatedProgress });
    } catch (error: any) {
      console.error(
        `Error updating watch progress for profileId: ${profileId}`,
        error
      );
      res.status(400).json({ error: error.message });
    }
  }
}
