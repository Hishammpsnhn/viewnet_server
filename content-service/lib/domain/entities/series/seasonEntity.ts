import { Types } from "mongoose";
import { EpisodeEntity } from "./episodeEntity";

export class SeasonEntity {
    constructor(
        public _id: Types.ObjectId,
        public seriesId: Types.ObjectId,
        public seasonNumber: number,
        public releaseDate: Date,
        public episodes: EpisodeEntity[]
    ) {}
  }
  