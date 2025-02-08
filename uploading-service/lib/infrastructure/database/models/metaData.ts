import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { VideoMetadata } from "../../../domain/entities/VideoMetadata";

export interface IVideoMetadataDocument
  extends Omit<Document, "id">,
    VideoMetadata {
  _id: ObjectId;
}

const VideoMetadataSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    thumbnailUrl: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: false },
    uploadStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    releaseDateTime: { type: Date, required: true },
    block: { type: Boolean, required: true, default: false },
    uploadDate: { type: Date, required: true, default: Date.now },
    isRelease: { type: Boolean, required: true, default: false },
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
  {
    timestamps: true,
  }
);

export const VideoMetadataModel = mongoose.model<IVideoMetadataDocument>(
  "VideoMetadata",
  VideoMetadataSchema
);
