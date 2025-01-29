import { Schema, model, Document } from "mongoose";
import { EpisodeEntity } from "../../../../domain/entities/series/episodeEntity";

export interface IEpisodeDocument
  extends Omit<Document, "id">,
    EpisodeEntity {}

const episodeSchema = new Schema(
  {
    season: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    videoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const EpisodeModel = model<IEpisodeDocument>("Episode", episodeSchema);

export default EpisodeModel;
