import cron from "node-cron";
import { ReleaseMovie } from "../../use-cases/releseMovie";
import { SeriesUseCase } from "../../use-cases/series/SeriesUseCase";
import { VideoMetadataRepository } from "../repositories/VideoMetadataRepository";
import { SeriesRepository } from "../repositories/series/SeriesRepository";
import { LiveProducer } from "../../infrastructure/queue/NotificationProducer";
const liveProducer = new LiveProducer();

function movieReleaseCron() {
  cron.schedule("0 0 * * *", async () => {
    console.log("Cron Job: Checking Release statuses...");
    const repo = new ReleaseMovie(new VideoMetadataRepository(),liveProducer);
    
    const seriesUseCase = new SeriesUseCase(new SeriesRepository());

    try {
      await repo.execute();
      await seriesUseCase.releaseSeries()
      console.log("Cron Job: Release status updates completed.");
    } catch (error) {
      console.error("Cron Job: Error updating Release statuses:", error);
    }
  });
}

export default movieReleaseCron;
