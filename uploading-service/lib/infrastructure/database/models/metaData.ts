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
    movieUrl: { type: String, required: true },
    //trailer: { type: String, required: true },
    //cast: { type: [String], required: true },
    //director: { type: String, required: true },
    //language: { type: String, required: true },
    description: { type: String, required: true },
    //genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
    genre: { type: String, required: true },
    // rating: { type: String, required: true },
    // likes: { type: Number, required: true },
    uploadStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    releaseDateTime: { type: Date, required: true },
    block: { type: Boolean, required: true, default: false },
    uploadDate: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const VideoMetadataModel = mongoose.model<IVideoMetadataDocument>(
  "VideoMetadata",
  VideoMetadataSchema
);
