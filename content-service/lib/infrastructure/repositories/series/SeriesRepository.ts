import { ISeriesRepository } from "../../../domain/interface/series/ISeriesRepository";
import SeriesModel from "../../database/models/series/series";
import "../../database/models/series/season";
import "../../database/models/series/episode";
import { SeriesEntity } from "../../../domain/entities/series/seriesEntity";
import { SeasonEntity } from "../../../domain/entities/series/seasonEntity";
import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import redisClient from "../../cache/RedisRepository";

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
                        episode.transcoding
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
  async findById(id: string): Promise<SeriesEntity> {
    try {
      const seriesData = await  SeriesModel.findById(id);
      if(!seriesData || seriesData.isBlock || !seriesData.isRelease){
        throw new Error("Series not found or not available for release");
      }
      const series = await SeriesModel.findById(id).populate({
        path: "seasons",
        populate: {
          path: "episodes",
        },
      });
      console.log(series);

      if (!series) throw new Error("Series not found");

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
                      episode.transcoding
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
