import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";
import { VideoMetadata } from "../domain/entities/VideoMetadata";

export class ReleaseMovie {
  private repository: IVideoMetadataRepository;
  constructor(repository: IVideoMetadataRepository) {
    this.repository = repository;
  }

  async execute(currentDate = new Date()) {
    const movies = await this.repository.findRelease(currentDate);
    console.log("movies gone to release",movies)
    for (const movie of movies) {
      if (movie._id)
        await this.repository.update(movie._id.toString(), { isRelease: true });
    }
  }
}
