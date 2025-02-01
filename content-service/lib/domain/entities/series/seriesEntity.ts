import { Schema, Types } from "mongoose";
import { SeasonEntity } from "./seasonEntity";

export class SeriesEntity {
  constructor(
    public _id: Types.ObjectId,
    public title: string,
    public description: string,
    public genre: string,
    public releaseDate: Date,
    public rating: number,
    public posterImage: string,
    public seasons: SeasonEntity[]
  ) {}

}
