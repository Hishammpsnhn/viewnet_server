import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import { IEpisodeRepository } from "../../../domain/interface/series/IEpisodeRepository";
import EpisodeModel from "../../database/models/series/episode";
import SeasonModel from "../../database/models/series/season";


export class EpisodeRepository implements IEpisodeRepository {
  async create(data: EpisodeEntity): Promise<EpisodeEntity> {
    const episode = new EpisodeModel(data);
    const season = await SeasonModel.findById(data.seasonId);
    if(!season){
      throw new Error("Season not found");
    }
    console.log("episode season details",season)
    season?.episodes.push(episode.id)
    await episode.save();
    await season.save();
    return episode.toObject();
  }

  async findById(id: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findById(id);
    return episode ? episode.toObject() : null;
  }
  async findByKey(key: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findOne({key:key});
    return episode ? episode.toObject() : null;
  }

  async findBySeasonId(seasonId: string): Promise<EpisodeEntity[]> {
    const episodes = await EpisodeModel.find({ season: seasonId });
    return episodes.map((e) => e.toObject());
  }

  async updateByKey(key: string, data: Partial<EpisodeEntity>): Promise<EpisodeEntity | null> {
    const episodeDetail = await EpisodeModel.findOne({ key: key });
    console.log("found using key",episodeDetail)
    const episode = await EpisodeModel.findByIdAndUpdate(episodeDetail?.id, data, { new: true });
    console.log("found using id",episode)
    return episode ? episode.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EpisodeModel.findByIdAndDelete(id);
    return result !== null;
  }
}
