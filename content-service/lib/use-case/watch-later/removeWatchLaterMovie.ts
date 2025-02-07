
import WatchLaterRepository from "../../infrastructure/repositories/WatchLaterMoviesRepository";

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
      await this.watchLaterRepository.remove(profileId, catalogId);
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
