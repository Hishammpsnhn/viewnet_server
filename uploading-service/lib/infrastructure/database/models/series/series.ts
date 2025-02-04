import { Schema, model, Document, ObjectId } from "mongoose";
import { SeriesEntity } from "../../../../domain/entities/series/seriesEntity";

export interface ISeriesDoc extends Omit<Document, "id">, SeriesEntity {
  _id:ObjectId;
}

const seriesSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, required: true },
    isBlock:{type: Boolean, required: true,default:false},
    isRelease: { type: Boolean, required: true, default: false },
    posterImage: { type: String, required: true },
    seasons: [{ type: Schema.Types.ObjectId, ref: "Season" }],
  },
  { timestamps: true }
);

const SeriesModel = model<ISeriesDoc>("Series", seriesSchema);

export default SeriesModel;
