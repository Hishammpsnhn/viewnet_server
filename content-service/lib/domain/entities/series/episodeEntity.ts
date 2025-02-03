import { Types } from "mongoose";

export class EpisodeEntity {
    constructor(
        public _id: Types.ObjectId,
        public seasonId: Types.ObjectId,
        public episodeNumber: number,
        public title: string,
        public description: string,
        public key:string,
        public duration: number,
        public releaseDate: Date,
        public thumbnailUrl:string,
        public videoUrl: string,
        public transcoding: "pending" | "completed" | "processing" | "failed"
    ) {}
  }
  