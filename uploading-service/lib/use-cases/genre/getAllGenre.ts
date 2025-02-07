import { Genre } from "../../domain/entities/genre";
import { GenreRepository } from "../../infrastructure/repositories/genreRepository";


export class GetAllGenreUseCase {
  private genreRepository: GenreRepository;

  constructor(genreRepository: GenreRepository) {
    this.genreRepository = genreRepository;
  }

  async execute(): Promise<Genre[]> {
    const genre = await this.genreRepository.find();
    return genre;
  }
}
