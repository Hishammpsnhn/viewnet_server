import { IVideoMetadataRepository } from '../domain/interface/IVideoMetadataRepository';
import { VideoMetadata } from '../domain/entities/VideoMetadata';
import { MovieProducer } from '../infrastructure/queue/MovieProducer';

export class UpdateVideoMetadataUseCase {
  constructor(
    private videoMetadataRepository: IVideoMetadataRepository,
   // private movieProducer: MovieProducer 
  ) {}
  async execute(id: string, data: Partial<VideoMetadata>): Promise<VideoMetadata | null> {
    if (!id) {
      throw new Error('ID is required to update video metadata.');
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data is required.');
    }

    const updatedMetadata = await this.videoMetadataRepository.update(id, data);

    if (!updatedMetadata) {
      throw new Error('Video metadata not found or update failed.');
    }
    const movieMetadata = { ...updatedMetadata }; 

   // await this.movieProducer.sendMovie(movieMetadata);

    return updatedMetadata;
  }
}
