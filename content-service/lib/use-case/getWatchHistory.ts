import { WatchHistoryDTO } from "../infrastructure/data/WatchHistoryDto";
import WatchHistoryRepository from "../infrastructure/repositories/WatchHistoryRepository";

interface WatchHistoryEntry {
  profileId: string;
  videoCatalogId: string;
  progress: number;
  completed: boolean;
  timestamp: Date;
  metadata?: any;
}

interface GetWatchHistoryPayload {
  profileId: string;
}

class GetWatchHistoryUseCase {
  private watchProgressRepository: WatchHistoryRepository;


  constructor(watchProgressRepository: WatchHistoryRepository) {
    this.watchProgressRepository = watchProgressRepository;
   
  }

  async execute(profileId:string): Promise<WatchHistoryDTO[]> {
    try {
      const watchHistory = await this.watchProgressRepository.getHistoryOfProfile(profileId);
      return watchHistory
    } catch (error) {
      console.error(`Error in GetWatchHistoryUseCase for profileId: ${profileId}`, error);
      throw new Error("Failed to fetch watch history due to an internal error.");
    }
  }

}

export default GetWatchHistoryUseCase;
