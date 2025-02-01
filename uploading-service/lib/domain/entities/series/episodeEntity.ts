import mongoose from "mongoose";

export class EpisodeEntity {
  constructor(
    public seasonId: string,
    public episodeNumber: number,
    public title: string,
    public description: string,
    public duration: number,
    public releaseDate: Date,
    public key: string,
    public videoUrl: string,
    public thumbnailUrl: string,
    public transcoding: "pending" | "completed" | "processing" | "failed"
  ) {}
}
