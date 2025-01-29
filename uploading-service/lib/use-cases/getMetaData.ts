import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class GetVideoMetadata {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute(id:string) {
    return await this.repository.findById(id);
  }
}
