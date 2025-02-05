import WatchHistory from "../domain/entities/WatchHistory";
import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";

interface UpdateProgressPayload {
  profileId: string; 
  videoCatalogId: string; 
}

class ContinueWatchProgressUseCase {
  private watchProgressRepository: WatchHistoryRepository;

  constructor(watchProgressRepository: WatchHistoryRepository) {
    this.watchProgressRepository = watchProgressRepository;
  }

  async execute({
    profileId,
    videoCatalogId,
  }: UpdateProgressPayload): Promise<WatchHistory> {
    // Retrieve the existing watch progress
    let watchProgress =
      await this.watchProgressRepository.findByProfileAndVideo(
        profileId,
        videoCatalogId
      );

    if (!watchProgress) {
      // If no progress found, create a new entry
      watchProgress = new WatchHistory(profileId, videoCatalogId, 1);
      await this.watchProgressRepository.save(watchProgress);
    }

    return watchProgress;
  }
}

export default ContinueWatchProgressUseCase;
