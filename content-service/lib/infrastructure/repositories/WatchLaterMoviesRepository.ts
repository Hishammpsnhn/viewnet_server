import { Movie } from "../../domain/entities/MovieMetadata";
import WatchLaterMovie from "../../domain/entities/WatchLaterMovie";
import redisClient from "../cache/RedisRepository";
import { WatchHistoryDTO } from "../data/WatchHistoryDto";
import { WatchLaterDTO } from "../data/WatchLaterDto";
import WatchLaterMovieModel from "../database/models/WatchLater/WatchLaterMovies";
import { Document, Types } from "mongoose";

class WatchLaterRepository {
//   private readonly CACHE_PREFIX = 'watch_later:';
//   private readonly CACHE_TTL = 3600; // 1 hour in seconds

  async findByProfileAndVideo(
    profileId: string,
    videoCatalogId: string
  ): Promise<WatchLaterMovie | null> {
    
    // const cacheKey = `${this.CACHE_PREFIX}${profileId}:${videoCatalogId}`;
    // const cachedData = await redisClient.get(cacheKey);
    
    // if (cachedData) {
    //   const parsed = JSON.parse(cachedData);
    //   return new WatchLaterMovie(parsed.profileId, parsed.videoCatalogId);
    // }

    // If not in cache, query database
    const data = await WatchLaterMovieModel.findOne({
      profileId,
      videoCatalogId,
    }).lean();

    if (!data) return null;

    // Cache the result
    // await this.cacheWatchLater(
    //   data.profileId.toString(),
    //   data.videoCatalogId.toString()
    // );

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

    // Update cache
    // await this.cacheWatchLater(profileId, videoCatalogId);
  }

  async remove(profileId: string, videoCatalogId: string): Promise<void> {
    await WatchLaterMovieModel.deleteOne({
      profileId: new Types.ObjectId(profileId),
      videoCatalogId,
    });

    // Remove from cache
    // const cacheKey = `${this.CACHE_PREFIX}${profileId}:${videoCatalogId}`;
    // await redisClient.del(cacheKey);
  }

  async findAllByProfile(profileId: string): Promise<WatchLaterDTO[]> {
    const watchLaterList = await WatchLaterMovieModel.find({
      profileId: new Types.ObjectId(profileId),
    }).populate<{videoCatalogId:Movie}>({
      path:"videoCatalogId",
      model:"VideoMetadata",
      select:"title description thumbnailUrl",
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

//   private async cacheWatchLater(
//     profileId: string,
//     videoCatalogId: string
//   ): Promise<void> {
//     const cacheKey = `${this.CACHE_PREFIX}${profileId}:${videoCatalogId}`;
//     const data = {
//       profileId,
//       videoCatalogId,
//     };

//     await redisClient.setex(
//       cacheKey,
//       this.CACHE_TTL,
//       JSON.stringify(data)
//     );
//   }

//   async clearProfileCache(profileId: string): Promise<void> {
//     const pattern = `${this.CACHE_PREFIX}${profileId}:*`;
//     const keys = await redisClient.keys(pattern);
    
//     if (keys.length > 0) {
//       await redisClient.del(keys);
//     }
//   }
}

export default WatchLaterRepository;