import { ObjectId } from "mongoose";

export class SeriesEntity {
    constructor(
      public title: string,
      public description: string,
      public genre: string,
      public releaseDate: Date,
      public rating: number,
      public posterImage: string,
      public seasons: string[] ,
      public _id : ObjectId,
      public isBlock: boolean,
      public isRelease: boolean
    ) {}
  }
  