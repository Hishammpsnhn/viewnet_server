import { IEncodedFile, MovieCatalog } from "../../domain/entities/VideoCatalog";
import { IVideoCatalogRepository } from "../../domain/interface/IVideoCatalogRepositoryl";
import { MovieCatalogModel } from "../database/models/catalog"; // Assuming you have a Mongoose model
import mongoose from 'mongoose';

export class MovieCatalogRepository implements IVideoCatalogRepository {
  async getCatalog(id: string): Promise<MovieCatalog> {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }

    const moviesData = await MovieCatalogModel.findOne({ metadataId: id });
    if (!moviesData) {
      throw new Error(`Movie catalog with id ${id} not found`);
    }

    // Convert metadataId (ObjectId) to string
    const metadataIdString = moviesData.metadataId?.toString();

    return new MovieCatalog(
      moviesData._id.toString(), 
      moviesData.encodedFiles,
      moviesData.movieName,
      metadataIdString || '', 
    );
  }



}