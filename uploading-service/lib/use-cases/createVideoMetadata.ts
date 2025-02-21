import { VideoMetadata } from "../domain/entities/VideoMetadata";
import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";

export class CreateVideoMetadata {
  private repository: IVideoMetadataRepository;

  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute(data: VideoMetadata): Promise<VideoMetadata> {
    const alreadyExist = await this.repository.findByTitle(data.title) 
    if(alreadyExist){
      throw new Error(`A video with title ${data.title} already exists.`);
    }
    return await this.repository.create(data);
  }
}
