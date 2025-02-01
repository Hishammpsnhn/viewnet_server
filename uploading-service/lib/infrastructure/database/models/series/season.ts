import { Schema, model, Document } from "mongoose";
import { SeasonEntity } from "../../../../domain/entities/series/seasonEntity";

export interface ISeasonDocument extends SeasonEntity {}



const seasonSchema = new Schema(
  {
    seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true },
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
  },
  { timestamps: true }
);

const SeasonModel = model<ISeasonDocument>("Season", seasonSchema);

export default SeasonModel;
