import { Movie } from "../entities/MovieMetadata";

export interface IVideoMetadataRepository {
  findById(id:string): Promise<Movie>;
  findLatest(limit?: number): Promise<Movie[]>;
}
