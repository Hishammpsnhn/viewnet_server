// src/domain/repositories/IMovieCatalogRepository.ts
import { MovieCatalog } from '../entities/VideoCatalog';

export interface IMovieCatalogRepository {
  findById(id: string): Promise<MovieCatalog | null>;
  create(movieCatalog: MovieCatalog): Promise<MovieCatalog>;
  update(id: string, movieCatalog: MovieCatalog): Promise<MovieCatalog | null>;
  delete(id: string): Promise<boolean>;
}
