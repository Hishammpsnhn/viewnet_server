import { IEncodedFile, MovieCatalog } from "../../domain/entities/VideoCatalog";
import { MovieCatalogModel } from "../database/models/catalog"; // Assuming you have a Mongoose model

export class MovieCatalogRepository {
  async create(movieCatalog: MovieCatalog): Promise<MovieCatalog> {
    const movieCatalogDoc = new MovieCatalogModel(movieCatalog);
    const savedCatalog = await movieCatalogDoc.save();
    return savedCatalog.toDomain(); 
  }

  async update(id: string, encodedFiles: IEncodedFile[]): Promise<MovieCatalog> {
    const updatedCatalog = await MovieCatalogModel.findByIdAndUpdate(
      id,
      { encodedFiles },
      { new: true }
    );

    if (!updatedCatalog) {
      throw new Error(`Movie catalog with id ${id} not found`);
    }

    return updatedCatalog.toDomain(); 
  }

}
