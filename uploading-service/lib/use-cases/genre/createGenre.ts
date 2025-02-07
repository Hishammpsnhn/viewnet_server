import { Genre } from "../../domain/entities/genre";
import { GenreRepository } from "../../infrastructure/repositories/genreRepository";


export class CreateGenreUseCase {
  private genreRepository: GenreRepository;

  constructor(genreRepository: GenreRepository) {
    this.genreRepository = genreRepository;
  }

  async execute(data: { id: string; name: string; description?: string,isActive:boolean }): Promise<Genre> {
    
    if(data.id){
      const AlreadyExist = await this.genreRepository.findById(data.id);
      if (AlreadyExist) {
        const updateGenre = await this.genreRepository.findByIdAndUpdate(
          data.id,
          data
        );
        if(updateGenre)
        return updateGenre;
      }
    }
    const genre = new Genre({
      
      name: data.name,
      description: data.description,
    });

    const createdGenre = await this.genreRepository.create(genre);
    return createdGenre;
  }
}
