import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import { IEpisodeRepository } from "../../../domain/interface/series/IEpisodeRepository";
import EpisodeModel from "../../database/models/series/episode";


export class EpisodeRepository implements IEpisodeRepository {
  async create(data: EpisodeEntity): Promise<EpisodeEntity> {
    const episode = new EpisodeModel(data);
    await episode.save();
    return episode.toObject();
  }

  async findById(id: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findById(id);
    return episode ? episode.toObject() : null;
  }

  async findBySeasonId(seasonId: string): Promise<EpisodeEntity[]> {
    const episodes = await EpisodeModel.find({ season: seasonId });
    return episodes.map((e) => e.toObject());
  }

  async update(id: string, data: Partial<EpisodeEntity>): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findByIdAndUpdate(id, data, { new: true });
    return episode ? episode.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EpisodeModel.findByIdAndDelete(id);
    return result !== null;
  }
}
