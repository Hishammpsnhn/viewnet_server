import { ISeriesRepository } from "../domain/interface/series/ISeriesRepository";

export class GetSeriesDetails {
  private repository: ISeriesRepository;
  constructor(repository: ISeriesRepository) {
    this.repository = repository;
  }

  async execute(id:string) {
    return await this.repository.findById(id);
  }
}