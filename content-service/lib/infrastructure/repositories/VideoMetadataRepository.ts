import { Movie } from "../../domain/entities/MovieMetadata";
import { MovieCatalog } from "../../domain/entities/VideoCatalog";
import { IVideoMetadataRepository } from "../../domain/interface/IVideoMetadataRepository";
import { MovieModel } from "../database/models/metaData";
import { MovieCatalogModel } from "../database/models/catalog";
import redisClient from "../cache/RedisRepository";
import mongoose from "mongoose";

export class MovieMetadataRepository implements IVideoMetadataRepository {
  private CACHE_KEY = "latest_movies";
  private CACHE_EXPIRATION = 3600;
  async findLatest(page: number, limit: number = 5): Promise<Movie[]> {
    const offset = (page - 1) * limit;

    if (redisClient.status === "ready") {
      const cachedMovies = await redisClient.get(this.CACHE_KEY);

      if (cachedMovies) {
        console.log("Cache Hit - Returning cached data");
        const allMovies = JSON.parse(cachedMovies);

        return allMovies.slice(offset, offset + limit);
      }
    }
    console.log("Cache Miss - Fetching from DB");

    // Fetch all movies from the database (without pagination)
    const moviesData = await MovieModel.find({
      block: false,
      isRelease: true,
      uploadStatus: "success",
      "transcoding.status": "completed",
    }).sort({ releaseDate: -1 });

    // Map the database results to Movie objects
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
    if (redisClient.status === "ready") {
      await redisClient.set(
        this.CACHE_KEY,
        JSON.stringify(movies),
        "EX",
        this.CACHE_EXPIRATION
      );
    }

    return movies.slice(offset, offset + limit);
  }
  async searchQuery(query: string): Promise<Movie[]> {
    const moviesData = await MovieModel.find({
      title: { $regex: query, $options: "i" },
      block: false,
      isRelease: true,
      uploadStatus: "success",
      "transcoding.status": "completed",
    })
      .select("title description genre thumbnailUrl")
      .limit(10);
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
        movie.updatedAt,
        undefined,
        true,
      );
    });

    return movies;
  }
  async findById(id: string): Promise<Movie> {
    const movie = await MovieModel.findById(id).select(
      "title thumbnailUrl description "
    );
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

  async recommendedMovies(watchedGenres: string[]): Promise<Movie[]> {
    console.log("watchedGenres", watchedGenres);

    const movies = await MovieModel.aggregate([
      {
        $match: {
          genre: {
            $in: watchedGenres,
          },
          block: false,
          isRelease: true,
        },
      },
    ]);
    // _id: { $nin: history.map(h => h.videoCatalogId._id) },

    return movies.map((movie) => {
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
  }
}
