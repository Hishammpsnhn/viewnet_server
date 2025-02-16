import WatchTimeRepository from "../../infrastructure/repository/WatchTimeRepository";

class WatchTimeService {
    async updateWatchTime(userId: string, watchTime: number): Promise<void> {
        await WatchTimeRepository.updateWatchTime(userId, watchTime);
    }

    async getWatchTime(userId: string):  Promise<{ day: string; watchTime: number }[]>  {
        return await WatchTimeRepository.getWatchTime(userId);
    }
}

export default new WatchTimeService();
