import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";
import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetRecommendedMoviesUseCase {
  private watchProgressRepository: WatchHistoryRepository;
  private videoMetadataRepository: IVideoMetadataRepository;

  constructor(
    watchProgressRepository: WatchHistoryRepository,
    videoMetadataRepository: IVideoMetadataRepository
  ) {
    this.watchProgressRepository = watchProgressRepository;
    this.videoMetadataRepository = videoMetadataRepository;
  }

  async execute(profileId: string) {
    try {
      if (!profileId) {
        return [];
      }
      const watchHistory =
        await this.watchProgressRepository.getHistoryOfProfile(profileId);
      const genres = watchHistory
        .map((watch) => watch?.videoCatalog?.genre)
        .filter((genre) => genre !== undefined);


      const movies = await this.videoMetadataRepository.recommendedMovies(
        genres
      );
      console.log("movies: ", movies);
      return movies;
    } catch (error) {
      console.error(
        `Error in GetWatchHistoryUseCase for profileId: ${profileId}`,
        error
      );
      throw new Error(
        "Failed to fetch watch history due to an internal error."
      );
    }
  }
}
