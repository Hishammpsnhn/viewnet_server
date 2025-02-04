import { Schema, model, Document, Types } from "mongoose";
import { ISeasonDocument } from "./season";

export interface SeriesType extends Document {
  _id: Types.ObjectId;
  title: string;
  isBlock: boolean;
  description: string;
  genre: string;
  releaseDate: Date;
  rating: number;
  isRelease:boolean;
  posterImage: string;
  seasons: ISeasonDocument[];
  createdAt?: Date;
  updatedAt?: Date;
}


const seriesSchema = new Schema<SeriesType>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    posterImage: { type: String, required: true },
    isBlock:{type: Boolean, required: true,default:false},
    isRelease:{type: Boolean, required: true,default:true},
    seasons: [{ type: Schema.Types.ObjectId, ref: "Season" }],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Series model
const SeriesModel = model<SeriesType>("Series", seriesSchema);

export default SeriesModel;
