import { VideoMetadataModel } from '../database/models/metaData';
import { IVideoMetadataRepository } from '../../domain/interface/IVideoMetadataRepository';
import { VideoMetadata } from '../../domain/entities/VideoMetadata';

export class VideoMetadataRepository implements IVideoMetadataRepository {
  async create(data: VideoMetadata): Promise<VideoMetadata> {
    const video = new VideoMetadataModel(data);
    return await video.save();
  }

  async findById(id: string): Promise<VideoMetadata | null> {
    return await VideoMetadataModel.findById(id).lean();
  }
  async findByTitle(title: string): Promise<VideoMetadata | null> {
    return await VideoMetadataModel.findOne({title}).lean();
  }

  async findAll(): Promise<VideoMetadata[]> {
    return await VideoMetadataModel.find().lean();
  }

  async update(id: string, data: Partial<VideoMetadata>): Promise<VideoMetadata | null> {
    return await VideoMetadataModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await VideoMetadataModel.findByIdAndDelete(id);
    return result !== null;
  }
}
