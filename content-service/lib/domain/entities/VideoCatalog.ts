import mongoose from 'mongoose';

export interface IEncodedFile {
  encodingStatus?: string;
  fileUrl?: string;
  format?: string;
  resolution?: '1080p' | '720p' | '480p' | '360p' | 'auto';
}

export class MovieCatalog {
  private _id: string;
  private encodedFiles: IEncodedFile[];
  private metadataId: string;
  private movieName: string;

  constructor(
    id: string,
    encodedFiles: IEncodedFile[],
    movieName: string,
    metadataId: string,
  ) {
    // Validate ObjectId (optional)
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
    if (!mongoose.isValidObjectId(metadataId)) {
      throw new Error(`Invalid ObjectId: ${metadataId}`);
    }

    this._id = id;
    this.encodedFiles = encodedFiles;
    this.metadataId = metadataId;
    this.movieName = movieName;
  }
}