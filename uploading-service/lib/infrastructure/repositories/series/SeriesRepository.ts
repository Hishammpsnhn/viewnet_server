

import { SeriesEntity } from "../../../domain/entities/series/seriesEntity";
import { ISeriesRepository } from "../../../domain/interface/series/ISeriesRepository";
import SeriesModel from "../../database/models/series/series";

export class SeriesRepository implements ISeriesRepository {
  async create(data: SeriesEntity): Promise<SeriesEntity> {
    const series = new SeriesModel(data);
    await series.save();
    return series.toObject(); // Convert Mongoose document to plain object
  }

  async findById(id: string): Promise<SeriesEntity | null> {
    const series = await SeriesModel.findById(id).populate("seasons");
    return series ? series.toObject() : null;
  }

  async findAll(): Promise<SeriesEntity[]> {
    const series = await SeriesModel.find().populate("seasons");
    return series.map((s) => s.toObject());
  }

  async findByTitle(title: string): Promise<SeriesEntity | null> {
    const series = await SeriesModel.findOne({ title }).populate("seasons");
    return series ? series.toObject() : null;
  }

  async update(id: string, data: Partial<SeriesEntity>): Promise<SeriesEntity | null> {
    const series = await SeriesModel.findByIdAndUpdate(id, data, { new: true }).populate("seasons");
    return series ? series.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await SeriesModel.findByIdAndDelete(id);
    return result !== null;
  }
}
