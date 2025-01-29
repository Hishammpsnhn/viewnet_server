import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetAllVideoMetadata {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute() {
    return await this.repository.findAll();
  }
}
