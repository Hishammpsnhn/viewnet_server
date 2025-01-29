export class SeriesEntity {
    constructor(
      public title: string,
      public description: string,
      public genre: string,
      public releaseDate: Date,
      public rating: number,
      public posterImage: string,
      public seasons: string[] // Array of season IDs
    ) {}
  }
  