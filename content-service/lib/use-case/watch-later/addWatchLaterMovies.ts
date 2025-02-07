// import { WatchHistoryDTO } from "../infrastructure/data/WatchHistoryDto";
import { WatchLaterDTO } from "../../infrastructure/data/WatchLaterDto";
import WatchLaterRepository from "../../infrastructure/repositories/WatchLaterSeriesRepository";

class AddWatchLaterUseCase {
  private watchLaterRepository: WatchLaterRepository;
  constructor(repository: WatchLaterRepository) {
    this.watchLaterRepository = repository;
  }

  async execute(profileId: string, catalogId: string): Promise<void> {
    if(!profileId || !catalogId){
      throw new Error("ProfileId and CatalogId are required");  
  }
    try {
      await this.watchLaterRepository.save(profileId, catalogId);
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

export default AddWatchLaterUseCase;
