import amqp from "amqplib";
import { UpdateTranscodingStatusUseCase } from "../../use-cases/updateMovieTranscodeStatus";
import { VideoMetadataRepository } from "../../infrastructure/repositories/VideoMetadataRepository";
import environment from "../../infrastructure/config/environment";
import { logger } from "../../infrastructure/logger/logger";
import { IEncodedFile, MovieCatalog } from "../../domain/entities/VideoCatalog";
import mongoose, { Types } from "mongoose";
import { GetVideoMetadata } from "../../use-cases/getMetaData";
import { MovieCatalogRepository } from "../../infrastructure/repositories/MovieCatalog";
import { EpisodeUseCase } from "../../use-cases/series/EpisodeUseCase";
import { EpisodeRepository } from "../../infrastructure/repositories/series/EpisodeRepository";

const repository = new VideoMetadataRepository();
const updateTranscode = new UpdateTranscodingStatusUseCase(repository);
const getMovieMetadata = new GetVideoMetadata(repository);
const movieCatalogRepository = new MovieCatalogRepository();
const episodeUseCase = new EpisodeUseCase(new EpisodeRepository());

export async function consumeMessages() {
  const connection = await amqp.connect(environment.RABBITMQ_URL as string);
  const channel = await connection.createChannel();
  await channel.assertQueue("transcoding.complete", { durable: true });

  console.log("📥 Listening for transcoding completion messages...");

  channel.consume("transcoding.complete", async (msg) => {
    if (!msg) return;

    try {
      console.log(msg);
      const movieId = JSON.parse(msg.content.toString());
      console.log("✅ Received message:", movieId);

      if (mongoose.Types.ObjectId.isValid(movieId)) {
        await updateTranscode.execute(movieId, { status: "completed" });

        const movieMetadata = await getMovieMetadata.execute(movieId);
        if (!movieMetadata || !movieMetadata._id || !movieMetadata) {
          logger.info(`Movie not found: ${movieId}`);
          return;
        }

        const encodedFiles: IEncodedFile[] = [
          {
            encodingStatus: "completed",
            fileUrl: `https://${environment.CLOUDFRONT_KEY}.cloudfront.net/hls/${movieMetadata.title}/1080p/index.m3u8`,
            format: "mp4",
            resolution: "1080p",
          },
          {
            encodingStatus: "completed",
            fileUrl: `https://${environment.CLOUDFRONT_KEY}.cloudfront.net/hls/${movieMetadata._id}/master.m3u8`,
            format: "mp4",
            resolution: "auto",
          },
          {
            encodingStatus: "completed",
            fileUrl: `https://${environment.CLOUDFRONT_KEY}.cloudfront.net/hls/${movieMetadata._id}/720p/index.m3u8`,
            format: "mp4",
            resolution: "720p",
          },
          {
            encodingStatus: "completed",
            fileUrl: `https://${environment.CLOUDFRONT_KEY}.cloudfront.net/hls/${movieMetadata._id}/480p/index.m3u8`,
            format: "mp4",
            resolution: "480p",
          },
          {
            encodingStatus: "completed",
            fileUrl: `https://${environment.CLOUDFRONT_KEY}.cloudfront.net/hls/${movieMetadata._id}/360p/index.m3u8`,
            format: "mp4",
            resolution: "360p",
          },
        ];
        const newCatalog = new MovieCatalog(
          new Types.ObjectId().toHexString(),
          encodedFiles,
          movieMetadata?.title,
          movieId
        );
        await movieCatalogRepository.create(newCatalog);
        logger.info(`Created catalog entry for movie: ${movieMetadata.title}`);

        console.log(`🎬 Movie "${movieMetadata.title}" updated to "completed"`);
        channel.ack(msg);
      } else {
        // const episode = await episodeUseCase.getEpisodeByKey(movieId);
        // if (!episode || episode._id) {
        //   logger.info(`Movie not found: ${movieId}`);
        //   return;
        // }
        // const res = await episodeUseCase.updateEpisode(episode.key, {
        //   transcoding: "completed",
        // });
        // if (episode._id) {
        //   episodeUseCase.createEpisodeCatalog(episode._id, episode.key, "mp4");
        // }
        // channel.ack(msg);
      }
    } catch (error: any) {
      console.error("❌ Error updating movie status:", error);

      // Prevent infinite retry loops for non-recoverable errors
      if (error.recoverable) {
        channel.nack(msg, false, true);
      } else {
        channel.nack(msg, false, false);
      }
    }
  });
}
