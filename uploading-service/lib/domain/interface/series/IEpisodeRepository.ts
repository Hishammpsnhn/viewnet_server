import { EpisodeEntity } from "../../entities/series/episodeEntity";
import { ResolutionEntity } from "../../entities/series/episodeCatalog";

export interface IEpisodeRepository {
  create(data: EpisodeEntity): Promise<EpisodeEntity>;
  createCatalog(data: ResolutionEntity): Promise<ResolutionEntity>;
  getCatalog(id:string): Promise<ResolutionEntity | null>;
  findById(id: string): Promise<EpisodeEntity | null>;
  findByKey(key: string): Promise<EpisodeEntity | null>;
  // findAll(): Promise<EpisodeEntity[]>;

  findBySeasonId(seasonId: string): Promise<EpisodeEntity[]>;
  updateByKey(
    id: string,
    data: Partial<EpisodeEntity>
  ): Promise<EpisodeEntity | null>;
  delete(id: string): Promise<boolean>;
}
