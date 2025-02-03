import { EpisodeEntity } from "../../entities/series/episodeEntity";
import { ResolutionEntity } from "../../entities/series/episodeCatalog";

export interface IEpisodeRepository {
  findByKey(id: string): Promise<EpisodeEntity | null>;
  findCatalog(id: string): Promise<ResolutionEntity | null>;
 
}
