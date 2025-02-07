import { Genre } from "../../domain/entities/genre";
import { GenreModel } from "../database/models/genre";

export class GenreRepository {

  async create(genreData: Genre): Promise<Genre> {
    const genre = new Genre(genreData.toPlainObject());
    const savedGenre = await GenreModel.create({
      name: genre.name,
      description: genre.description,
    });
    return Genre.fromPlainObject({
      id:savedGenre.id,
      name: savedGenre.name,
      description: savedGenre.description,
      isActive: savedGenre.isActive,
    });
  }


  async findById(id: string): Promise<Genre | null> {
    const foundGenre = await GenreModel.findById(id);
    if (!foundGenre) return null;

    return Genre.fromPlainObject({
      id:foundGenre.id,
      name: foundGenre.name,
      description: foundGenre.description,
      isActive: foundGenre.isActive,
    });
  }
  async findByIdAndUpdate(id: string,data:Partial<Genre>): Promise<Genre | null> {
    const foundGenre = await GenreModel.findByIdAndUpdate(id,data)
    if (!foundGenre) return null;

    return Genre.fromPlainObject({
      id:foundGenre.id,
      name: foundGenre.name,
      description: foundGenre.description,
      isActive: foundGenre.isActive,
    });
  }

  async find():Promise<Genre[]> {
    const genres = await GenreModel.find({})
    return genres.map((genre) =>
      Genre.fromPlainObject({
        id:genre.id,
        name: genre.name,
        description: genre.description,
        isActive: genre.isActive,

      }))    
  }
}

export const genreRepository = new GenreRepository();
