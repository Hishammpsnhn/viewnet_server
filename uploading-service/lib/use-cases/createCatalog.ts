// src/usecases/MovieCatalogUseCase.ts
import { IMovieCatalogRepository } from '../domain/interface/IMovieCatalog';
import { MovieCatalog } from '../domain/entities/VideoCatalog';

export class MovieCatalogUseCase {
  constructor(private movieCatalogRepo: IMovieCatalogRepository) {}

  async createMovieCatalog(movieCatalog: MovieCatalog): Promise<MovieCatalog> {
    return this.movieCatalogRepo.create(movieCatalog);
  }

//   async getMovieCatalog(id: string): Promise<MovieCatalog | null> {
//     return this.movieCatalogRepo.findById(id);
//   }

//   async updateMovieCatalog(id: string, movieCatalog: MovieCatalog): Promise<MovieCatalog | null> {
//     return this.movieCatalogRepo.update(id, movieCatalog);
//   }

//   async deleteMovieCatalog(id: string): Promise<boolean> {
//     return this.movieCatalogRepo.delete(id);
//   }
}
