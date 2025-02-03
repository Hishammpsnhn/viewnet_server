import mongoose, { Schema, Document, model } from 'mongoose';
import { IEncodedFile } from '../../../domain/entities/VideoCatalog';

export interface IMovieCatalog extends Document {
  _id: mongoose.Types.ObjectId; // Explicitly define _id as ObjectId
  encodedFiles: IEncodedFile[];
  metadataId?: mongoose.Types.ObjectId;
  movieName: string;
}

const MovieCatalogSchema = new Schema<IMovieCatalog>({
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

export const MovieCatalogModel = model<IMovieCatalog>('MovieCatalog', MovieCatalogSchema);