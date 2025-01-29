import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { MovieCatalog, IEncodedFile } from '../../../domain/entities/VideoCatalog';

export interface IMovieCatalog extends Document {
  encodedFiles: IEncodedFile[];
  metadataId?: ObjectId;
  movieName: string;
  toDomain: () => MovieCatalog;
}

const MovieCatalogSchema: Schema = new Schema({
  encodedFiles: [
    {
      encodingStatus: { type: String, required: false },
      fileUrl: { type: String, required: false },
      format: { type: String, required: false },
      resolution: {
        type: String,
        enum: ['1080p', '720p', '480p', '360p', 'auto'],
        required: false,
      },
    },
  ],
  metadataId: { type: Schema.Types.ObjectId, required: false },
  movieName: { type: String, required: true },
});

MovieCatalogSchema.methods.toDomain = function (): MovieCatalog {
  // Ensure that _id and metadataId are valid ObjectIds
  const id = this._id && this._id.toString() !== '' ? this._id.toString() : null;
  const metadataId = this.metadataId && this.metadataId.toString() !== '' ? this.metadataId.toString() : null;

  return new MovieCatalog(
    id || '', // Provide a default empty string if _id is invalid
    this.encodedFiles,
    this.movieName,
    metadataId || '', // Provide a default empty string if metadataId is invalid
  );
};

export const MovieCatalogModel = mongoose.model<IMovieCatalog>('MovieCatalog', MovieCatalogSchema);
