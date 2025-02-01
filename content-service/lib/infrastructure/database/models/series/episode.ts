import { Schema, model, Document, Types } from "mongoose";
import { EpisodeEntity } from "../../../../domain/entities/series/episodeEntity";

export interface IEpisodeDocument extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  episodeNumber: number;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  key: string;
  releaseDate: Date;
  videoUrl: string;
}

const episodeSchema = new Schema<IEpisodeDocument>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    key: { type: String, required: true },  
    releaseDate: { type: Date, required: true },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const EpisodeModel = model("Episode", episodeSchema);

export default EpisodeModel;
