import { Movie } from "../entities/MovieMetadata";

export interface IVideoMetadataRepository {
  findLatest(limit?: number): Promise<Movie[]>;
}
