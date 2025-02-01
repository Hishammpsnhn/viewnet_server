import { ISeriesRepository } from "../../../domain/interface/series/ISeriesRepository";
import SeriesModel from "../../database/models/series/series";
import "../../database/models/series/season";
import "../../database/models/series/episode";
import { SeriesEntity } from "../../../domain/entities/series/seriesEntity";
import { SeasonEntity } from "../../../domain/entities/series/seasonEntity";
import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";

export class SeriesRepository implements ISeriesRepository {
  async findLatest(limit: number = 10): Promise<SeriesEntity[]> {
    try {
      const seriesData = await SeriesModel.find({})
        .sort({ releaseDate: -1 })
        .limit(limit);
      return seriesData.map((series) => {
        return new SeriesEntity(
          series._id,
          series.title,
          series.description,
          series.genre,
          series.releaseDate,
          series.rating,
          series.posterImage,
          series.seasons?.map(
            (season) =>
              new SeasonEntity(
                season._id,
                season.seriesId,
                season.seasonNumber,
                season.releaseDate,
                season.episodes?.map(
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
                      episode.videoUrl
                    )
                )
              )
          )
        );
      });
    } catch (error) {
      console.error("Error fetching latest series:", error);
      throw new Error("Failed to retrieve latest series.");
    }
  }

  // seriesRepository.ts
  async findById(id: string): Promise<SeriesEntity> {
    try {
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
        series.rating,
        series.posterImage,
        series.seasons.map(
          (season) =>
            new SeasonEntity(
              season._id,
              season.seriesId,
              season.seasonNumber,
              season.releaseDate,
              season.episodes.map(
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
                    episode.videoUrl
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
