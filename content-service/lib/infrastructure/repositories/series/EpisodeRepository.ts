import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import { IEpisodeRepository } from "../../../domain/interface/series/IEpisodeRepository";
import EpisodeModel from "../../database/models/series/episode";


export class EpisodeRepository implements IEpisodeRepository {

  async findByKey(id: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findOne({key:id});
    return episode ? episode.toObject() : null;
  }


}
