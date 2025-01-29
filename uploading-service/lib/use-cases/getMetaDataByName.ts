import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetVideoMetadata {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute(title:string) {
    return await this.repository.findByTitle(title);
  }
}
