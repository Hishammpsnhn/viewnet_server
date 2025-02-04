import { SeriesEntity } from '../../entities/series/seriesEntity';

export interface ISeriesRepository {
  create(data: SeriesEntity): Promise<SeriesEntity>;
  findById(id: string): Promise<SeriesEntity | null>;
  findAll(): Promise<SeriesEntity[]>;
  //findLatest(): Promise<SeriesEntity[]>;
  update(id: string, data: Partial<SeriesEntity>): Promise<SeriesEntity | null>;
  delete(id: string): Promise<boolean>;
  findSeriesToRelease(date:Date): Promise<SeriesEntity[]>;
  
}
