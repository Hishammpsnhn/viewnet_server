import { promises } from "dns";
import { Movie } from "../entities/MovieMetadata";

export interface IVideoMetadataRepository {
  findById(id:string): Promise<Movie>;
  searchQuery(query:string): Promise<Movie[]>;
  findLatest(limit?: number): Promise<Movie[]>;
  recommendedMovies(genres:string[]):Promise<Movie[]>
}
