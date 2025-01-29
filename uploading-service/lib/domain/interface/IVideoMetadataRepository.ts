import { VideoMetadata } from '../entities/VideoMetadata';

export interface IVideoMetadataRepository {
  create(data: VideoMetadata): Promise<VideoMetadata>;
  findById(id: string): Promise<VideoMetadata | null>;
  findByTitle(title: string): Promise<VideoMetadata | null>;
  findAll(): Promise<VideoMetadata[]>;
  update(id: string, data: Partial<VideoMetadata>): Promise<VideoMetadata | null>;
  delete(id: string): Promise<boolean>;

}
