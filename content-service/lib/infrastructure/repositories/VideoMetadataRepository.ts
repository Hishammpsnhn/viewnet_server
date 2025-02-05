import { Movie } from "../../domain/entities/MovieMetadata";
import { MovieCatalog } from "../../domain/entities/VideoCatalog";
import { IVideoMetadataRepository } from "../../domain/interface/IVideoMetadataRepository";
import { MovieModel } from "../database/models/metaData";
import { MovieCatalogModel } from "../database/models/catalog";
import redisClient from "../cache/RedisRepository";

export class MovieMetadataRepository implements IVideoMetadataRepository {
  private CACHE_KEY = "latest_movies";
  private CACHE_EXPIRATION = 3600; 
  async findLatest(limit: number = 10): Promise<Movie[]> {
    const cachedMovies = await redisClient.get(this.CACHE_KEY);
    if (cachedMovies) {
      console.log("Cache Hit - Returning cached data");
      return JSON.parse(cachedMovies);
    }

    console.log("Cache Miss - Fetching from DB");
    const moviesData = await MovieModel.find({
      block: false,
      isRelease:true,
      uploadStatus: "success",
      "transcoding.status": "completed",
    })
      .sort({ releaseDate: -1 })
      .limit(limit);
    const movies = moviesData.map((movie) => {
      return new Movie(
        movie._id,
        movie.title,
        movie.description,
        movie.genre,
        movie.thumbnailUrl,
        movie.uploadStatus,
        movie.releaseDateTime,
        movie.block,
        movie.isRelease,
        movie.uploadDate,
        movie.createdAt,
        movie.updatedAt
      );
    });

    // Store fetched data in Redis cache
    await redisClient.set(
      this.CACHE_KEY,
      JSON.stringify(movies),
      "EX",
      this.CACHE_EXPIRATION
    );
    return movies;
  }
  async findById(id: string): Promise<Movie> {
    const movie = await MovieModel.findById(id).select('title thumbnailUrl description ');
    if (!movie) {
      throw new Error("movie with this id not found");
    }
    return new Movie(
      movie._id,
      movie.title,
      movie.description,
      movie.genre,
      movie.thumbnailUrl,
      movie.uploadStatus,
      movie.releaseDateTime,
      movie.block,
      movie.isRelease,
      movie.uploadDate,
      movie.createdAt,
      movie.updatedAt
    );
  }
}
