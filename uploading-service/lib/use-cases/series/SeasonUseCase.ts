import { SeasonEntity } from "../../domain/entities/series/seasonEntity";
import { ISeasonRepository } from "../../domain/interface/series/ISeasonRepository";
import { ISeriesRepository } from "../../domain/interface/series/ISeriesRepository";

export class SeasonUseCase {
  private seasonRepository: ISeasonRepository;
  private seriesRepository: ISeriesRepository;
  constructor(
    seasonRepository: ISeasonRepository,
    seriesRepository: ISeriesRepository
  ) {
    this.seasonRepository = seasonRepository;
    this.seriesRepository = seriesRepository;
  }

  // Create a new season
  async createSeason(seriesId: string, seasonData: any) {
    // Ensure series exists
    // const series = await this.seriesRepository.findById(seriesId);
    // if (!series) {
    //   throw new Error("Series not found");
    // }

    // Create new season
    const season = await this.seasonRepository.create({
      ...seasonData,
      seriesId,
    });

    // // Update series with new season
    // const updatedSeasons = series.seasons
    //   ? [...series.seasons, season._id]
    //   : [season._id];
    // await this.seriesRepository.update(seriesId, { seasons: updatedSeasons });

    return season;
  }

  // Get season by ID
  async getSeasonById(id: string): Promise<SeasonEntity | null> {
    return this.seasonRepository.findById(id);
  }

  // Get all seasons for a series
  async getSeasonsBySeriesId(seriesId: string): Promise<SeasonEntity[]> {
    return this.seasonRepository.findBySeriesId(seriesId);
  }

  // Update season by ID
  async updateSeason(
    id: string,
    data: Partial<SeasonEntity>
  ): Promise<SeasonEntity | null> {
    return this.seasonRepository.update(id, data);
  }

  // Delete season by ID
  async deleteSeason(id: string): Promise<boolean> {
    return this.seasonRepository.delete(id);
  }
}
