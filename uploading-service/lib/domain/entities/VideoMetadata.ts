import { ObjectId } from "mongoose";

export interface VideoMetadata {
  _id?: ObjectId;
  title: string;
  thumbnailUrl: string;
  //trailer: string;
  //cast: string[];
  //director: string;
  //language: string;
  description: string;
  //genre: ObjectId;
  genre: string;
  //rating: string;
  //likes: number;
  uploadStatus: "pending" | "success" | "failed";
  releaseDateTime: Date;
  block: boolean;
  isRelease: boolean;
  // uploadDate: Date;
  transcoding?: {
    status: "pending" | "processing" | "completed" | "failed";
    availableResolutions?: string[]; // Optional array of resolutions if needed
    format?: string[]; // Optional array of formats if needed
  };
}
