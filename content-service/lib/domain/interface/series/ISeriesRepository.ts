import { SeriesEntity, SeriesMeta } from "../../entities/series/seriesEntity";

export interface ISeriesRepository {
  findLatest(limit?: number): Promise<SeriesEntity[]>;
  findById(id: string, profileId?: string): Promise<SeriesEntity>;
  searchQuery(q: string): Promise<SeriesMeta[]>;
}
