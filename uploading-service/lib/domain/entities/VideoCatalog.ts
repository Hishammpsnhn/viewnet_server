// src/domain/entities/VideoCatalog.ts

export interface IEncodedFile {
  encodingStatus?: string;
  fileUrl?: string;
  format?: string;
  resolution?: '1080p' | '720p' | '480p' |'360p'|'auto'; // You can add more resolutions here
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
    // Ensure that id and metadataId are valid ObjectId strings
   
    this._id = id;
    this.encodedFiles = encodedFiles;
    this.metadataId = metadataId;
    this.movieName = movieName;
  }

  getId(): string {
    return this._id;
  }

  getEncodedFiles(): IEncodedFile[] {
    return this.encodedFiles;
  }

  getMetadataId(): string {
    return this.metadataId;
  }
}
