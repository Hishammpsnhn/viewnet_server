import { IEpisodeRepository } from "../domain/interface/series/IEpisodeRepository";

export class GetEpisodeCatalogDetails {
  private repository: IEpisodeRepository;
  constructor(repository: IEpisodeRepository) {
    this.repository = repository;
  }

  async execute(id:string) {
    return await this.repository.findCatalog(id);
  }
}