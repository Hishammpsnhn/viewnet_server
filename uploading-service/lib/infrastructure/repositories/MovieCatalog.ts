// src/infrastructure/repositories/MovieCatalogRepository.ts
import { IEncodedFile, MovieCatalog } from "../../domain/entities/VideoCatalog";
import { MovieCatalogModel } from "../database/models/catalog"; // Assuming you have a Mongoose model

export class MovieCatalogRepository {
  // Create a new catalog entry
  async create(movieCatalog: MovieCatalog): Promise<MovieCatalog> {
    console.log('Creating movie catalog:')
    const movieCatalogDoc = new MovieCatalogModel(movieCatalog);
    console.log(movieCatalogDoc)
    const savedCatalog = await movieCatalogDoc.save();
    console.log("saved catalog: " + savedCatalog)
    return savedCatalog.toDomain(); // Assuming you have a `toDomain` method
  }

  // Update an existing catalog entry with encoded file details
  async update(id: string, encodedFiles: IEncodedFile[]): Promise<MovieCatalog> {
    const updatedCatalog = await MovieCatalogModel.findByIdAndUpdate(
      id,
      { encodedFiles },
      { new: true }
    );

    if (!updatedCatalog) {
      throw new Error(`Movie catalog with id ${id} not found`);
    }

    return updatedCatalog.toDomain(); // Assuming you have a `toDomain` method
  }

  // Other repository methods like `findById`, `delete`, etc.
}
