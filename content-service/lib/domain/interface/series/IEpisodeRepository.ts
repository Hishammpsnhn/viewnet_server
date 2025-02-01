import { EpisodeEntity } from "../../entities/series/episodeEntity";

export interface IEpisodeRepository {
  findByKey(id: string): Promise<EpisodeEntity | null>;
 
}
