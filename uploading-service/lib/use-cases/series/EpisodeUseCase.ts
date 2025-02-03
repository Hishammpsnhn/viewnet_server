import { ResolutionEntity } from "../../domain/entities/series/episodeCatalog";
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
  async createEpisodeCatalog(
    episodeId: string,
    key: string,
    format: string
  ): Promise<ResolutionEntity> {
    if (!key || !format || !episodeId) {
      throw new Error("missing credentials");
    }

    const baseUrl =
      "https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls";

    const resolutions = (
      ["1080p", "720p", "480p", "360p", "auto"] as const
    ).map((resolution) => ({
      resolution,
      fileUrl:
        resolution === "auto"
          ? `${baseUrl}/${key}/master.m3u8`
          : `${baseUrl}/${key}/${resolution}/index.m3u8`,
      format,
    }));

    return this.episodeRepository.createCatalog({
      episodeId,
      key,
      resolutions,
    });
  }

  // Get episode by ID
  async getEpisodeById(id: string): Promise<EpisodeEntity | null> {
    return this.episodeRepository.findById(id);
  }
  async getEpisodeCatalogById(id: string): Promise<ResolutionEntity | null> {
    return this.episodeRepository.getCatalog(id);
  }

  // Get episode by KEY
  async getEpisodeByKey(key: string): Promise<EpisodeEntity | null> {
    return this.episodeRepository.findByKey(key);
  }

  // Get all episodes for a season
  async getEpisodesBySeasonId(seasonId: string): Promise<EpisodeEntity[]> {
    return this.episodeRepository.findBySeasonId(seasonId);
  }

  // Update episode by ID

  async updateEpisode(
    key: string,
    data: Partial<EpisodeEntity>
  ): Promise<EpisodeEntity | null> {
    return this.episodeRepository.updateByKey(key, data);
  }

  // Delete episode by ID
  async deleteEpisode(id: string): Promise<boolean> {
    return this.episodeRepository.delete(id);
  }
}
