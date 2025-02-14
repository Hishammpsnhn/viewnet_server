import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetLatestSeries {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute(page: number,limit:number) {
    return await this.repository.findLatest(page,limit);
  }
}
