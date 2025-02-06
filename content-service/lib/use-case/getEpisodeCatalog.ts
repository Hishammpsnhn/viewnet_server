import { IEpisodeRepository } from "../domain/interface/series/IEpisodeRepository";
import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";

export class GetEpisodeCatalogDetails {
  private repository: IEpisodeRepository;
  private watchProgressRepository: WatchHistoryRepository;
  constructor(
    repository: IEpisodeRepository,
    watchProgressRepository: WatchHistoryRepository
  ) {
    this.repository = repository;
    this.watchProgressRepository = watchProgressRepository;
  }

  async execute(id: string, profileId: string) {
    let watchProgress = null;
    if (profileId) {
      watchProgress = await this.watchProgressRepository.findByProfileAndVideo(
        profileId,
        id
      );
    }
    const catalog = await this.repository.findCatalog(id);
    return { ...catalog, progress: watchProgress?.progress ? watchProgress : 0 };
  }
}
