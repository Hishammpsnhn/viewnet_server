export class EpisodeEntity {
    constructor(
      public seasonId: string, 
      public episodeNumber: number,
      public title: string,
      public description: string,
      public duration: number, 
      public releaseDate: Date,
      public videoUrl: string
    ) {}
  }
  