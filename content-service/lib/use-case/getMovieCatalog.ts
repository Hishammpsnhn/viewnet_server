import WatchHistory from "../domain/entities/WatchHistory";
import { IVideoCatalogRepository } from "../domain/interface/IVideoCatalogRepositoryl";
import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";
import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";

export class GetMovieCatalog {
  private repository: IVideoCatalogRepository;
  private metaRepository: IVideoMetadataRepository;
  private watchHistoryRepository: WatchHistoryRepository;
  constructor(
    repository: IVideoCatalogRepository,
    metaRepository: IVideoMetadataRepository,
    watchHistoryRepository: WatchHistoryRepository
  ) {
    this.repository = repository;
    this.metaRepository = metaRepository;
    this.watchHistoryRepository = watchHistoryRepository;
  }
  async execute(id: string, profileId?: string | null) {
    const movie = await this.metaRepository.findById(id);
    if (movie.block) {
      throw new Error("Movie is blocked");
    }
    let watchHistory = null;
    if (profileId) {
      watchHistory = await this.watchHistoryRepository.findByProfileAndVideo(
        profileId,
        id
      );
      if (!watchHistory) {
        // If no progress found, create a new entry
        const watchProgress = new WatchHistory(profileId, id, 1);
        await this.watchHistoryRepository.save(watchProgress);
      }
    }
    const catalog = await this.repository.getCatalog(id);

    return {
      catalog,
      watchHistory,
    };
  }
}
