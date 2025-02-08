import { Movie } from "../../domain/entities/MovieMetadata";
import WatchHistory from "../../domain/entities/WatchHistory";
import redisClient from "../cache/RedisRepository";
import { WatchHistoryDTO } from "../data/WatchHistoryDto";
import HistoryModel from "../database/models/WatchHistoryModel";
import { Document, Types } from "mongoose";

interface WatchHistoryData {
  profileId: string;
  videoCatalogId: string;
  progress: number;
  completed: boolean;
  timestamp: Date;
}

class WatchHistoryRepository {
  async findByProfileAndVideo(
    profileId: string,
    videoCatalogId: string
  ): Promise<WatchHistory | null> {
    const data = await HistoryModel.findOne({
      profileId,
      videoCatalogId,
    }).lean();
    if (!data) return null;

    return new WatchHistory(
      data.profileId.toString(),
      data.videoCatalogId.toString(),
      data.progress,
      data.completed,
      data.timestamp
    );
  }

  async save(watchProgress: WatchHistory): Promise<void> {
    const { profileId, videoCatalogId, progress, completed, timestamp } =
      watchProgress;

    await HistoryModel.findOneAndUpdate(
      { profileId, videoCatalogId },
      { progress, completed, timestamp },
      { upsert: true, new: true }
    );
  }

  async getHistoryOfProfile(profileId: string): Promise<WatchHistoryDTO[]> {
    const data = await HistoryModel.find({ profileId, isHide: false })
      .populate<{
        videoCatalogId: Movie;
      }>({
        path: "videoCatalogId",
        model: "VideoMetadata",
        select: "title description duration thumbnailUrl genre",
      })
      .sort({ updatedAt: -1 })
      .lean();

    console.log(data);
    return data.map((item) => ({
      profileId: item.profileId.toString(),
      videoCatalog: {
        _id: item.videoCatalogId?._id.toString(),
        title: item.videoCatalogId?.title.toString(),
        thumbnailUrl: item.videoCatalogId?.thumbnailUrl.toString(),
        description: item.videoCatalogId?.description,
        genre: item.videoCatalogId?.genre,
      },
      progress: item.progress,
      completed: item.completed,
      timestamp: item.timestamp,
    }));
  }

  async clearHistory(profileId: string): Promise<void> {
    await HistoryModel.updateMany({ profileId }, { isHide: true });
  }
}

export default WatchHistoryRepository;
