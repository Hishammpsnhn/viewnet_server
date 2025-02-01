// import { SeasonEntity } from "../../../domain/entities/series/seasonEntity";
// import { ISeasonRepository } from "../../../domain/interface/series/ISeasonRepository";
// import SeasonModel from "../../database/models/series/season";


// export class SeasonRepository implements ISeasonRepository {
//   async create(data: SeasonEntity): Promise<SeasonEntity> {
//     const season = new SeasonModel(data);
//     await season.save();
//     return season.toObject();
//   }

//   async findById(id: string): Promise<SeasonEntity | null> {
//     const season = await SeasonModel.findById(id).populate("episodes");
//     return season ? season.toObject() : null;
//   }

//   async findBySeriesId(seriesId: string): Promise<SeasonEntity[]> {
//     const seasons = await SeasonModel.find({ series: seriesId }).populate("episodes");
//     return seasons.map((s) => s.toObject());
//   }

//   async update(id: string, data: Partial<SeasonEntity>): Promise<SeasonEntity | null> {
//     const season = await SeasonModel.findByIdAndUpdate(id, data, { new: true }).populate("episodes");
//     return season ? season.toObject() : null;
//   }

//   async delete(id: string): Promise<boolean> {
//     const result = await SeasonModel.findByIdAndDelete(id);
//     return result !== null;
//   }
// }
