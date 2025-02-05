import WatchHistory from "../../domain/entities/WatchHistory.js";
import HistoryModel from "../database/models/WatchHistoryModel.js";

class WatchHistoryRepository {
  async findByProfileAndVideo(profileId, videoCatalogId) {
    const data = await HistoryModel.findOne({ profileId, videoCatalogId });
    if (!data) return null;

    return new WatchHistory(
      data.profileId,
      data.videoCatalogId,
      data.progress,
      data.completed,
      data.timestamp
    );
  }

  async save(watchProgress) {
    const { profileId, videoCatalogId, progress, completed, timestamp } =
      watchProgress;

    await HistoryModel.findOneAndUpdate(
      { profileId, videoCatalogId },
      { progress, completed, timestamp },
      { upsert: true, new: true }
    );
  }

  async getHistoryOfProfile(profileId) {
    const data = await HistoryModel.find({ profileId }).sort({ updatedAt: -1 });
    return data.map(
      (item) =>
        new WatchHistory(
          item.profileId,
          item.videoCatalogId,
          item.progress,
          item.completed
        )
    );
  }
}
export default WatchHistoryRepository;
