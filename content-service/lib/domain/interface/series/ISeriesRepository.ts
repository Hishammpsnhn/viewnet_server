import { SeriesEntity } from '../../entities/series/seriesEntity';

export interface ISeriesRepository {

  findLatest(limit?: number): Promise<SeriesEntity[]>;
  findById(id:string,profileId?:string): Promise<SeriesEntity>;


}
