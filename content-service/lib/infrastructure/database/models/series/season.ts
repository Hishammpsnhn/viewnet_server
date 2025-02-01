import { Schema, model, Document, Types } from "mongoose";
import { SeasonEntity } from "../../../../domain/entities/series/seasonEntity";
import { IEpisodeDocument } from "./episode";


export interface ISeasonDocument extends Document {
  _id: Types.ObjectId;
  seriesId: Types.ObjectId;
  seasonNumber: number;
  releaseDate: Date;
  episodes: IEpisodeDocument[];
}
const seasonSchema = new Schema<ISeasonDocument>(
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
