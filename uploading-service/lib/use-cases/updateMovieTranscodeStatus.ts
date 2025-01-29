import { IVideoMetadataRepository } from '../domain/interface/IVideoMetadataRepository';
import { VideoMetadata } from '../domain/entities/VideoMetadata';

export class UpdateTranscodingStatusUseCase {
  constructor(private videoMetadataRepository: IVideoMetadataRepository) {}

  async execute(
    id: string,
    transcodingData: {
      status: 'pending' | 'processing' | 'completed' | 'failed';
      availableResolutions?: string[];
      formats?: string[];
    }
  ): Promise<VideoMetadata | null> {
    if (!id) {
      throw new Error('ID is required to update transcoding status.');
    }

    if (!transcodingData || !transcodingData.status) {
      throw new Error('Transcoding status is required.');
    }

    // Validate transcoding status
    const validStatuses = ['pending', 'processing', 'completed', 'failed'];
    if (!validStatuses.includes(transcodingData.status)) {
      throw new Error('Invalid transcoding status.');
    }

    // Validate available resolutions
    if (transcodingData.availableResolutions) {
      const validResolutions = ['1080p', '720p', '480p', '360p', 'auto'];
      const invalidResolutions = transcodingData.availableResolutions.filter(
        (res) => !validResolutions.includes(res)
      );
      if (invalidResolutions.length > 0) {
        throw new Error(`Invalid resolutions: ${invalidResolutions.join(', ')}`);
      }
    }

    // Update transcoding details
    const updatedMetadata = await this.videoMetadataRepository.update(id, {
      transcoding: transcodingData,
    });

    if (!updatedMetadata) {
      throw new Error('Video metadata not found or update failed.');
    }

    return updatedMetadata;
  }
}
