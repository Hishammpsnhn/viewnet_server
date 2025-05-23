import { Schema, model, Document } from "mongoose";
import { EpisodeEntity } from "../../../../domain/entities/series/episodeEntity";

export interface IEpisodeDocument extends Omit<Document, "id">, EpisodeEntity {}

const episodeSchema = new Schema(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    thumbnailUrl: { type: String, required: true },
    // isBlock: { type: Boolean, required: true, default: true },
    transcoding: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    key: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const EpisodeModel = model<IEpisodeDocument>("Episode", episodeSchema);

export default EpisodeModel;
