export class SeasonEntity {
    constructor(
      public seriesId: string, // Reference to the series
      public seasonNumber: number,
      public releaseDate: Date,
      public episodes: string[] // Array of episode IDs
    ) {}
  }
  