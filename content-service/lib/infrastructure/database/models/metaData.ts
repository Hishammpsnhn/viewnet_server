import { Schema, model } from "mongoose";
import { Movie } from "../../../domain/entities/MovieMetadata";

export interface MovieType extends Document {
  _id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  uploadStatus: string;
  releaseDateTime: Date;
  block: boolean;
  isRelease: boolean;
  transcoding: {
    status: string;
    availableResolutions: string[];
    format: string[];
  };
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<MovieType>(
  {
    title: { type: String, required: true, unique: true },
    thumbnailUrl: { type: String, required: true },
    //movieUrl: { type: String, required: true },
    description: { type: String, required: true },
    isRelease: { type: Boolean, required: true, default: false },
    genre: { type: String, required: true },
    uploadStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    releaseDateTime: { type: Date, required: true },
    block: { type: Boolean, required: true, default: false },
    uploadDate: { type: Date, required: true, default: Date.now },
    transcoding: {
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      availableResolutions: { type: [String], default: [] },
      format: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export const MovieModel = model<MovieType>("VideoMetadata", MovieSchema);
