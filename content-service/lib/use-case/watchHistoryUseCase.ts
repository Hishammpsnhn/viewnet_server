import WatchHistory from '../domain/entities/WatchHistory';
import WatchHistoryRepository from '../infrastructure/repositories/WatchHistoryRepository'; 

interface UpdateProgressPayload {
  profileId: string; // Profile ID should be a string
  videoCatalogId: string; // Video catalog ID should be a string
  progress: number; // Progress is a number (0-100)
}

class UpdateWatchProgressUseCase {
  private watchProgressRepository: WatchHistoryRepository;

  constructor(watchProgressRepository: WatchHistoryRepository) {
    this.watchProgressRepository = watchProgressRepository;
  }

  async execute({ profileId, videoCatalogId, progress }: UpdateProgressPayload): Promise<WatchHistory> {
    // Retrieve the existing watch progress
    let watchProgress = await this.watchProgressRepository.findByProfileAndVideo(profileId, videoCatalogId);

    if (!watchProgress) {
      // If no progress found, create a new entry
      watchProgress = new WatchHistory(profileId, videoCatalogId, progress, progress === 100);
    } else {
      // If existing progress is found, update it
      watchProgress.updateProgress(progress);
    }

    // Save the progress to the repository
    await this.watchProgressRepository.save(watchProgress);

    return watchProgress;
  }
}

export default UpdateWatchProgressUseCase;
