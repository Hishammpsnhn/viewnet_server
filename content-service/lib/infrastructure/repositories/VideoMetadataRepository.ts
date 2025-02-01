import { Movie } from "../../domain/entities/MovieMetadata";
import { IVideoMetadataRepository } from "../../domain/interface/IVideoMetadataRepository";
import { MovieModel } from "../database/models/metaData";

export class MovieMetadataRepository implements IVideoMetadataRepository {
  async findLatest(limit: number = 10): Promise<Movie[]> {
    const moviesData = await MovieModel.find({}).sort({ releaseDate: -1 }).limit(limit)
    return moviesData.map((movie)=>{
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
        )
    })
  }
}
