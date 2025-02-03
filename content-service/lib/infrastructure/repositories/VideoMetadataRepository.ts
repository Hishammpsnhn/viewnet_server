import { Movie } from "../../domain/entities/MovieMetadata";
import { MovieCatalog } from "../../domain/entities/VideoCatalog";
import { IVideoMetadataRepository } from "../../domain/interface/IVideoMetadataRepository";
import { MovieModel } from "../database/models/metaData";
import { MovieCatalogModel } from "../database/models/catalog";

export class MovieMetadataRepository implements IVideoMetadataRepository {
  async findLatest(limit: number = 10): Promise<Movie[]> {
    const moviesData = await MovieModel.find({
      uploadStatus: "success",
      "transcoding.status": "completed",
    })
      .sort({ releaseDate: -1 })
      .limit(limit);
    return moviesData.map((movie) => {
      return new Movie(
        movie._id,
        movie.title,
        movie.description,
        movie.genre,
        movie.thumbnailUrl,
        movie.uploadStatus,
        movie.releaseDateTime,
        movie.block,
        movie.uploadDate,
        movie.createdAt,
        movie.updatedAt
      );
    });
  }
  async findById(id: string): Promise<Movie> {
    const movie = await MovieModel.findById(id);
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
      movie.uploadDate,
      movie.createdAt,
      movie.updatedAt
    );
  }
}
