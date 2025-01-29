import { EpisodeEntity } from "../../domain/entities/series/episodeEntity";
import { IEpisodeRepository } from "../../domain/interface/series/IEpisodeRepository";

export class EpisodeUseCase {
  private episodeRepository: IEpisodeRepository;

  constructor(episodeRepository: IEpisodeRepository) {
    this.episodeRepository = episodeRepository;
  }

  // Create a new episode
  async createEpisode(data: EpisodeEntity): Promise<EpisodeEntity> {
    return this.episodeRepository.create(data);
  }

  // Get episode by ID
  async getEpisodeById(id: string): Promise<EpisodeEntity | null> {
    return this.episodeRepository.findById(id);
  }

  // Get all episodes for a season
  async getEpisodesBySeasonId(seasonId: string): Promise<EpisodeEntity[]> {
    return this.episodeRepository.findBySeasonId(seasonId);
  }

  // Update episode by ID
  async updateEpisode(id: string, data: Partial<EpisodeEntity>): Promise<EpisodeEntity | null> {
    return this.episodeRepository.update(id, data);
  }

  // Delete episode by ID
  async deleteEpisode(id: string): Promise<boolean> {
    return this.episodeRepository.delete(id);
  }
}
