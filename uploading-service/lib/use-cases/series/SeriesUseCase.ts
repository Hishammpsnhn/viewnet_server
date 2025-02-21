

import { SeriesEntity } from "../../domain/entities/series/seriesEntity";
import { ISeriesRepository } from "../../domain/interface/series/ISeriesRepository";

export class SeriesUseCase {
  private seriesRepository: ISeriesRepository;

  constructor(seriesRepository: ISeriesRepository) {
    this.seriesRepository = seriesRepository;
  }

  // Create a new series
  async createSeries(data: SeriesEntity): Promise<SeriesEntity> {
    return this.seriesRepository.create(data);
  }

  // Get series by ID
  async getSeriesById(id: string): Promise<SeriesEntity | null> {
    return this.seriesRepository.findById(id);
  }

  // Get all series
  async getAllSeries(): Promise<SeriesEntity[]> {
    return this.seriesRepository.findAll();
  }


  // Update series by ID
  async updateSeries(id: string, data: Partial<SeriesEntity>): Promise<SeriesEntity | null> {
    return this.seriesRepository.update(id, data);
  }

  async releaseSeries(currentDate = new Date()){
    const series =await  this.seriesRepository.findSeriesToRelease(currentDate)
    for(const videoData of series){
      if(videoData._id){
        await this.seriesRepository.update(videoData._id.toString(),{isRelease:true})
      }
    }
  }

  // Delete series by ID
  async deleteSeries(id: string): Promise<boolean> {
    return this.seriesRepository.delete(id);
  }
}
