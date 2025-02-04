import { VideoMetadataModel } from "../database/models/metaData";
import { IVideoMetadataRepository } from "../../domain/interface/IVideoMetadataRepository";
import { VideoMetadata } from "../../domain/entities/VideoMetadata";
import mongoose, { ObjectId } from "mongoose";

export class VideoMetadataRepository implements IVideoMetadataRepository {
  async create(data: VideoMetadata): Promise<VideoMetadata> {
    const video = new VideoMetadataModel(data);
    return await video.save();
  }

  async findById(id: string): Promise<VideoMetadata | null> {
    return await VideoMetadataModel.findById(id).lean();
  }
  async findByIdNonBlock(id: string): Promise<VideoMetadata | null> {
    const result = await VideoMetadataModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $addFields: { isBlock: false } },
    ]);

    return result.length > 0 ? result[0] : null;
  }
  async findByTitle(title: string): Promise<VideoMetadata | null> {
    return await VideoMetadataModel.findOne({ title }).lean();
  }

  async findAll(): Promise<VideoMetadata[]> {
    return await VideoMetadataModel.find().sort({ createdAt: -1 }).lean();
  }
  async findLatest(): Promise<VideoMetadata[]> {
    return await VideoMetadataModel.find().limit(5).lean();
  }
  async findRelease(date: Date): Promise<VideoMetadata[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    return await VideoMetadataModel.find({
      releaseDateTime: { $gte: startOfDay, $lt: endOfDay }, 
      isRelease: false,
    }).lean();
  }

  async update(
    id: string,
    data: Partial<VideoMetadata>
  ): Promise<VideoMetadata | null> {
    return await VideoMetadataModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await VideoMetadataModel.findByIdAndDelete(id);
    return result !== null;
  }
}
