import { SeasonEntity } from "../../domain/entities/series/seasonEntity";
import { ISeasonRepository } from "../../domain/interface/series/ISeasonRepository";


export class SeasonUseCase {
  private seasonRepository: ISeasonRepository;

  constructor(seasonRepository: ISeasonRepository) {
    this.seasonRepository = seasonRepository;
  }

  // Create a new season
  async createSeason(data: SeasonEntity): Promise<SeasonEntity> {
    return this.seasonRepository.create(data);
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
  async updateSeason(id: string, data: Partial<SeasonEntity>): Promise<SeasonEntity | null> {
    return this.seasonRepository.update(id, data);
  }

  // Delete season by ID
  async deleteSeason(id: string): Promise<boolean> {
    return this.seasonRepository.delete(id);
  }
}
