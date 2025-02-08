import { Schema, Types } from "mongoose";
import { SeasonEntity } from "./seasonEntity";

export class SeriesEntity {
  constructor(
    public _id: Types.ObjectId,
    public title: string,
    public description: string,
    public genre: string,
    public releaseDate: Date,
    public isBlock:boolean,
    public isRelease:boolean,
    public rating: number,
    public posterImage: string,
    public thumbnailUrl: string,
    public seasons: SeasonEntity[]
  ) {}

}
export class SeriesMeta {
  constructor(
    public _id: Types.ObjectId,
    public title: string,
    public description: string,
    public genre: string,
    public thumbnailUrl: string,
  ) {}

}
