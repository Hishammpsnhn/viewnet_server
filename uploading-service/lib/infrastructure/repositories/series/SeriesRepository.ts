import { Types } from "mongoose";
import { SeriesEntity } from "../../../domain/entities/series/seriesEntity";
import { ISeriesRepository } from "../../../domain/interface/series/ISeriesRepository";
import SeriesModel from "../../database/models/series/series";
import { invalidateMovieCache } from "../../cache/RedisRepository";

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

    const series = await SeriesModel.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("seasons");
      invalidateMovieCache(id);
    return series ? series.toObject() : null;
  }
  async findSeriesToRelease(date: Date): Promise<SeriesEntity[]> {
    console.log("Checking for series release...");

    const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));


    const series = await SeriesModel.find({
        releaseDate: { $gte: startOfDay, $lt: endOfDay },
        isRelease: false,
    });

    console.log("Series found:", series);

    return series;
}



  async delete(id: string): Promise<boolean> {
    const result = await SeriesModel.findByIdAndDelete(id);
    return result !== null;
  }
}
