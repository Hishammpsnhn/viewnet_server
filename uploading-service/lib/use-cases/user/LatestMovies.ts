import { IVideoMetadataRepository } from "../../domain/interface/IVideoMetadataRepository";

export class GetLatestVideoMetadata {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute() {
    return await this.repository.findLatest();
  }
}
