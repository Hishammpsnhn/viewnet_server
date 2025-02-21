import { Movie } from "../../domain/entities/MovieMetadata";
import WatchLaterMovie from "../../domain/entities/WatchLaterMovie";
import { WatchLaterDTO } from "../data/WatchLaterDto";
import WatchLaterMovieModel from "../database/models/WatchLater/WatchLaterMovies";
import { Document, Types } from "mongoose";

class WatchLaterRepository {
  async findByProfileAndVideo(
    profileId: string,
    videoCatalogId: string
  ): Promise<WatchLaterMovie | null> {
    const data = await WatchLaterMovieModel.findOne({
      profileId,
      videoCatalogId,
    }).lean();

    if (!data) return null;

    return new WatchLaterMovie(
      data.profileId.toString(),
      data.videoCatalogId.toString()
    );
  }

  async save(profileId: string, videoCatalogId: string): Promise<void> {
    const existing = await WatchLaterMovieModel.findOne({
      profileId: new Types.ObjectId(profileId),
      videoCatalogId,
    });

    if (existing) {
      return;
    }

    // Create new watch later entry
    const watchLater = new WatchLaterMovieModel({
      profileId: new Types.ObjectId(profileId),
      videoCatalogId,
      createdAt: new Date(),
    });

    await watchLater.save();
  }

  async remove(profileId: string, videoCatalogId: string): Promise<void> {
    await WatchLaterMovieModel.deleteOne({
      profileId: new Types.ObjectId(profileId),
      videoCatalogId,
    });
  }

  async findAllByProfile(profileId: string): Promise<WatchLaterDTO[]> {
    const watchLaterList = await WatchLaterMovieModel.find({
      profileId: new Types.ObjectId(profileId),
    })
      .populate<{ videoCatalogId: Movie }>({
        path: "videoCatalogId",
        model: "VideoMetadata",
        select: "title description thumbnailUrl",
      })
      .sort({ createdAt: -1 })
      .lean();

    return watchLaterList.map((item) => ({
      profileId: item.profileId.toString(),
      videoCatalog: {
        _id: item.videoCatalogId._id.toString(),
        title: item.videoCatalogId.title,
        description: item.videoCatalogId.description,
        thumbnailUrl: item.videoCatalogId.thumbnailUrl,
      },
    }));
  }
}

export default WatchLaterRepository;
