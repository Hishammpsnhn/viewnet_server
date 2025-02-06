import { ISeriesRepository } from "../../../domain/interface/series/ISeriesRepository";
import SeriesModel from "../../database/models/series/series";
import "../../database/models/series/season";
import "../../database/models/series/episode";
import { SeriesEntity } from "../../../domain/entities/series/seriesEntity";
import { SeasonEntity } from "../../../domain/entities/series/seasonEntity";
import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import redisClient from "../../cache/RedisRepository";
import ProgressModel from '../../database/models/WatchHistoryModel'
export class SeriesRepository implements ISeriesRepository {
  private CACHE_KEY = "latest_series";
  private CACHE_EXPIRATION = 3600;
  async findLatest(limit: number = 10): Promise<SeriesEntity[]> {
    try {
      const cachedSeries = await redisClient.get(this.CACHE_KEY);
      if (cachedSeries) {
        console.log("Cache Hit - Returning cached data");
        return JSON.parse(cachedSeries);
      }
      const seriesData = await SeriesModel.find({
        isBlock: false,
        isRelease: true,
      })
        .sort({ releaseDate: -1 })
        .limit(limit);

      const series = seriesData.map((series) => {
        return new SeriesEntity(
          series._id,
          series.title,
          series.description,
          series.genre,
          series.releaseDate,
          series.isBlock,
          series.isRelease,
          series.rating,
          series.posterImage,
          series.posterImage,
          series.seasons?.map(
            (season) =>
              new SeasonEntity(
                season._id,
                season.seriesId,
                season.seasonNumber,
                season.releaseDate,
                season.episodes
                  ?.filter((episode) => episode.transcoding === "completed")
                  .map(
                    (episode) =>
                      new EpisodeEntity(
                        episode._id,
                        episode.seasonId,
                        episode.episodeNumber,
                        episode.title,
                        episode.description,
                        episode.key,
                        episode.duration,
                        episode.releaseDate,
                        episode.thumbnailUrl,
                        episode.videoUrl,
                        episode.transcoding,
                        0
                      )
                  )
              )
          )
        );
      });
      await redisClient.set(
        this.CACHE_KEY,
        JSON.stringify(series),
        "EX",
        this.CACHE_EXPIRATION
      );
      return series;
    } catch (error) {
      console.error("Error fetching latest series:", error);
      throw new Error("Failed to retrieve latest series.");
    }
  }

  // seriesRepository.ts
  async findById(id: string, userId?: string): Promise<SeriesEntity> {
    try {
      // Fetch the series data
      const seriesData = await SeriesModel.findById(id);
      if (!seriesData || seriesData.isBlock || !seriesData.isRelease) {
        throw new Error("Series not found or not available for release");
      }
  
      // Populate the seasons and episodes
      const series = await SeriesModel.findById(id).populate({
        path: "seasons",
        populate: {
          path: "episodes",
        },
      });
  
      if (!series) throw new Error("Series not found");
  
      const progressData = await ProgressModel.find({
        profileId: userId,
        videoCatalogId: { $in: series.seasons.flatMap(season => season.episodes.map(episode => episode._id)) }
      });
  console.log("progressdata", progressData,series.seasons.flatMap(season => season.episodes.map(episode => episode._id)))
      // Create a map of episodeId to progress for quick lookup
      const progressMap = new Map(progressData.map(progress => [progress.videoCatalogId.toString(), progress.progress]));
  console.log("map", progressMap)
      // Fetch progress data for each episode
      // Map the series data to the SeriesEntity, including progress for each episode
      return new SeriesEntity(
        series._id,
        series.title,
        series.description,
        series.genre,
        series.releaseDate,
        series.isBlock,
        series.isRelease,
        series.rating,
        series.posterImage,
        series.posterImage,
        series.seasons.map(
          (season) =>
            new SeasonEntity(
              season._id,
              season.seriesId,
              season.seasonNumber,
              season.releaseDate,
              season.episodes
                ?.filter((episode) => episode.transcoding === "completed")
                .map(
                  (episode) =>
                    new EpisodeEntity(
                      episode._id,
                      episode.seasonId,
                      episode.episodeNumber,
                      episode.title,
                      episode.description,
                      episode.key,
                      episode.duration,
                      episode.releaseDate,
                      episode.thumbnailUrl,
                      episode.videoUrl,
                      episode.transcoding,
                      progressMap.get(episode._id.toString()) || 0 // Default progress to 0 if not found
                    )
                )
            )
        )
      );
    } catch (error) {
      console.error("Error fetching series:", error);
      throw new Error("Failed to retrieve series.");
    }
  }
}
