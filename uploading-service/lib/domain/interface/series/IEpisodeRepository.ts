import { EpisodeEntity } from "../../entities/series/episodeEntity";

export interface IEpisodeRepository {
  create(data: EpisodeEntity): Promise<EpisodeEntity>;
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
