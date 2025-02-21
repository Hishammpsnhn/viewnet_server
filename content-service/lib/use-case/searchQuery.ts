import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";
import { ISeriesRepository } from "../domain/interface/series/ISeriesRepository";

export class GetSearchQuery {
  private repository: IVideoMetadataRepository;
  private seriesRepository: ISeriesRepository;
  constructor(
    repository: IVideoMetadataRepository,
    seriesRepository: ISeriesRepository
  ) {
    this.repository = repository;
    this.seriesRepository = seriesRepository;
  }

  async execute(query: string) {
    const series = await this.seriesRepository.searchQuery(query);
    const movies = await this.repository.searchQuery(query);
    return [...series, ...movies];
  }
}
