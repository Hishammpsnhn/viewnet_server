import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";
import { VideoMetadata } from "../domain/entities/VideoMetadata";
import { TranscodingProducer } from "../infrastructure/queue/TranscodingProducer";

export class UpdateVideoMetadataUseCase {
  constructor(private videoMetadataRepository: IVideoMetadataRepository) {}
  async execute(
    id: string,
    data: Partial<VideoMetadata>
  ): Promise<VideoMetadata | null> {
    if (!id) {
      throw new Error("ID is required to update video metadata.");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("Update data is required.");
    }

    const updatedMetadata = await this.videoMetadataRepository.update(id, data);

    if (!updatedMetadata) {
      throw new Error("Video metadata not found or update failed.");
    }
    // if (updatedMetadata.transcoding?.status === "pending") {
    //   this.transcodingProducer.TriggerTranscoding(updatedMetadata);
    // }

    return updatedMetadata;
  }
}
