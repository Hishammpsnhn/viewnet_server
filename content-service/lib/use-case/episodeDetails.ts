import WatchHistory from "../domain/entities/WatchHistory";
import { IEpisodeRepository } from "../domain/interface/series/IEpisodeRepository";
import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";

export class GetEpisodeDetails {
  private repository: IEpisodeRepository;
  private watchProgressRepository: WatchHistoryRepository;
  constructor(
    repository: IEpisodeRepository,
    watchProgressRepository: WatchHistoryRepository
  ) {
    this.repository = repository;
    this.watchProgressRepository = watchProgressRepository;
  }
  async execute(id: string, profileId: string | null) {
    if (profileId) {
      let watchProgress =
        await this.watchProgressRepository.findByProfileAndVideo(profileId, id);

      if (!watchProgress) {
        watchProgress = new WatchHistory(profileId, id, 0);
      } else {
        // If existing progress is found, update it
        //watchProgress.updateProgress(progress);
      }
      await this.watchProgressRepository.save(watchProgress);
    }
    return await this.repository.findByKey(id);
  }
}
