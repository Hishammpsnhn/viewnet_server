import { ResolutionEntity } from "../../../domain/entities/series/episodeCatalog";
import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import { IEpisodeRepository } from "../../../domain/interface/series/IEpisodeRepository";
import EpisodeModel from "../../database/models/series/episode";
import EpisodeCatalogModel from "../../database/models/series/episodeCatalog";
import SeasonModel from "../../database/models/series/season";

export class EpisodeRepository implements IEpisodeRepository {
  async create(data: EpisodeEntity): Promise<EpisodeEntity> {
    const episode = new EpisodeModel(data);
    const season = await SeasonModel.findById(data.seasonId);
    if (!season) {
      throw new Error("Season not found");
    }
    season?.episodes.push(episode.id);
    await episode.save();
    await season.save();
    return episode.toObject();
  }
  async createCatalog(data: ResolutionEntity): Promise<ResolutionEntity> {
    const episodeCatalog = new EpisodeCatalogModel(data);
    await episodeCatalog.save();
    return episodeCatalog.toObject();
  }
  async getCatalog(id: string): Promise<ResolutionEntity | null > {
    const episodeCatalog = EpisodeCatalogModel.findOne({ episodeId: id });

    return episodeCatalog ;
  }

  async findById(id: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findById(id);
    return episode ? episode.toObject() : null;
  }
  async findByKey(key: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findOne({ key: key });
    return episode ? episode.toObject() : null;
  }

  async findBySeasonId(seasonId: string): Promise<EpisodeEntity[]> {
    const episodes = await EpisodeModel.find({ season: seasonId });
    return episodes.map((e) => e.toObject());
  }

  async updateByKey(
    key: string,
    data: Partial<EpisodeEntity>
  ): Promise<EpisodeEntity | null> {
    const episodeDetail = await EpisodeModel.findOne({ key: key });
    const episode = await EpisodeModel.findByIdAndUpdate(
      episodeDetail?.id,
      data,
      { new: true }
    );
    return episode ? episode.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EpisodeModel.findByIdAndDelete(id);
    return result !== null;
  }
}
