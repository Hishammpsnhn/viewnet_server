export class SeasonEntity {
    constructor(
      public seriesId: string, 
      public seasonNumber: number,
      public releaseDate: Date,
      public episodes: string[] 
    ) {}
  }
  