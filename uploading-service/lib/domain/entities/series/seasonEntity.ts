export class SeasonEntity {
    constructor(
      public _id: string,
      public seriesId: string, 
      public seasonNumber: number,
      public releaseDate: Date,
      public episodes: string[] 
    ) {}
  }
  