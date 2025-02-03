import { ResolutionEntity } from "../../../domain/entities/series/episodeCatalog";
import { EpisodeEntity } from "../../../domain/entities/series/episodeEntity";
import { IEpisodeRepository } from "../../../domain/interface/series/IEpisodeRepository";
import EpisodeModel from "../../database/models/series/episode";
import EpisodeCatalogModel from "../../database/models/series/episodeCatalog";


export class EpisodeRepository implements IEpisodeRepository {

  async findByKey(id: string): Promise<EpisodeEntity | null> {
    const episode = await EpisodeModel.findOne({key:id,transcoding:"completed"});
    return episode ? episode.toObject() : null;
  }

  async findCatalog(id: string): Promise<ResolutionEntity | null> {
    const episode = await EpisodeCatalogModel.findOne({episodeId:id});
    return episode ? episode.toObject() : null;
  }


}
