// src/domain/entities/Movie.ts

export class Movie {
  constructor(
    public _id: string,
    public title: string,
    public description: string,
    public genre: string,
    public thumbnailUrl: string,
    public uploadStatus: string,
    public releaseDateTime: Date,
    public block: boolean,
    public isRelease:boolean,
    public uploadDate: Date,
    public createdAt: Date,
    public updatedAt: Date,
    public posterImage?: string
  ) {}
}
