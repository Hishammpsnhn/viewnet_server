import { ISeriesRepository } from "../domain/interface/series/ISeriesRepository";

export class GetLatestSeries {
  private repository: ISeriesRepository;
  constructor(repository: ISeriesRepository) {
    this.repository = repository;
  }

  async execute() {
    return await this.repository.findLatest();
  }
}
