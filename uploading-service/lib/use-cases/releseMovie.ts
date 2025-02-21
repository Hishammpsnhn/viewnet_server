import { IVideoMetadataRepository } from "../domain/interface/IVideoMetadataRepository";
import { VideoMetadata } from "../domain/entities/VideoMetadata";
import { LiveProducer } from "../infrastructure/queue/NotificationProducer";

export class ReleaseMovie {
  private repository: IVideoMetadataRepository;
  private liveNotification:LiveProducer
  constructor(repository: IVideoMetadataRepository,liveNotification:LiveProducer) {
    this.repository = repository;
    this.liveNotification = liveNotification;
  }

  async execute(currentDate = new Date()) {
    const movies = await this.repository.findRelease(currentDate);
    for (const movie of movies) {
      if (movie._id)
        await this.repository.update(movie._id.toString(), { isRelease: true });
      // send notification 
      await this.liveNotification.sendLiveNotification(movie);
    }
  }
}
