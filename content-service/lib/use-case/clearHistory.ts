import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";

class GetWatchHistoryUseCase {
  private watchProgressRepository: WatchHistoryRepository;

  constructor(watchProgressRepository: WatchHistoryRepository) {
    this.watchProgressRepository = watchProgressRepository;
  }

  async execute(profileId: string): Promise<void> {
    try {
      await this.watchProgressRepository.clearHistory(profileId);
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

export default GetWatchHistoryUseCase;
