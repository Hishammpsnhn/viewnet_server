export class EpisodeEntity {
    constructor(
      public seasonId: string, // Reference to the season
      public episodeNumber: number,
      public title: string,
      public description: string,
      public duration: number, // Duration in minutes
      public releaseDate: Date,
      public videoUrl: string
    ) {}
  }
  