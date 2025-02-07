// import { WatchHistoryDTO } from "../infrastructure/data/WatchHistoryDto";
import { WatchLaterDTO } from "../../infrastructure/data/WatchLaterDto";
import WatchLaterRepository from "../../infrastructure/repositories/WatchLaterMoviesRepository";

class GetWatchLaterUseCase {
  private watchLaterRepository: WatchLaterRepository;
  constructor(repository: WatchLaterRepository) {
    this.watchLaterRepository = repository;
  }

  async execute(profileId: string): Promise<WatchLaterDTO[]> {
    if(!profileId ){
      throw new Error("ProfileId  are required");  
  }
    try {
      const watchLater = await this.watchLaterRepository.findAllByProfile(
        profileId
      );
      return watchLater;
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

export default GetWatchLaterUseCase;
