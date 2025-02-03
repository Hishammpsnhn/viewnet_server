import { Types } from "mongoose";
import { SeriesEntity } from "../../../domain/entities/series/seriesEntity";
import { ISeriesRepository } from "../../../domain/interface/series/ISeriesRepository";
import SeriesModel from "../../database/models/series/series";

export class SeriesRepository implements ISeriesRepository {
  async create(data: SeriesEntity): Promise<SeriesEntity> {
    const series = new SeriesModel(data);
    await series.save();
    return series.toObject(); 
  }

  async findById(id: string): Promise<SeriesEntity | null> {
    console.log("id from repo", id);
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

    if (!objectId) {
      console.error("Invalid ID format:", id);
      return null;
    }

    const series = await SeriesModel.findById(objectId).populate({
      path: "seasons",
      populate: {
        path: "episodes",
      },
    });

    console.log(series);
    return series;
  }

  async findAll(): Promise<SeriesEntity[]> {
    console.log("find all")
    const series = await SeriesModel.find({});
    console.log(series)
    return series;
  }

  async findByTitle(title: string): Promise<SeriesEntity | null> {
    const series = await SeriesModel.findOne({ title }).populate("seasons");
    return series ? series.toObject() : null;
  }

  async update(
    id: string,
    data: Partial<SeriesEntity>
  ): Promise<SeriesEntity | null> {
    console.log("data to update", data);
    const series = await SeriesModel.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("seasons");
    console.log("series after updatte", series);
    return series ? series.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await SeriesModel.findByIdAndDelete(id);
    return result !== null;
  }
}
