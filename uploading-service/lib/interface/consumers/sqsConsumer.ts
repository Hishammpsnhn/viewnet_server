import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { sqsClient } from "../../infrastructure/aws/sqsClient";
import { parseS3Event } from "../../infrastructure/aws/s3EventParser";
import { processS3Event } from "../../use-cases/processS3Event";
import { EpisodeProcessS3Event } from "../../use-cases/EpisodeProcessS3Event";
import mongoose from "mongoose";
import { GetVideoMetadata } from "../../use-cases/getMetaData";
import { UpdateTranscodingStatusUseCase } from "../../use-cases/updateMovieTranscodeStatus";
import { VideoMetadataRepository } from "../../infrastructure/repositories/VideoMetadataRepository";
import { logger } from "../../infrastructure/logger/logger"; 
import { EpisodeUseCase } from "../../use-cases/series/EpisodeUseCase";
import { EpisodeRepository } from "../../infrastructure/repositories/series/EpisodeRepository";
import { EpisodeEntity } from "../../domain/entities/series/episodeEntity";
import environment from "../../infrastructure/config/environment";

const QUEUE_URL = environment.SQS_QUEUE_URL
type TranscodingStatus = "pending" | "processing" | "completed" | "failed";

const repository = new VideoMetadataRepository();
const getMovieMetadata = new GetVideoMetadata(repository);
const updateTranscode = new UpdateTranscodingStatusUseCase(repository);
const episodeUseCase = new EpisodeUseCase(new EpisodeRepository());

async function updateMovieTranscodingStatus(
  movieId: string,
  status: TranscodingStatus
) {
  try {
    const res = await updateTranscode.execute(movieId, { status });
    if (res) {
      logger.info(`Transcoding status updated to ${status}`);
      logger.info(res);
    }
  } catch (error: any) {
    logger.error(
      `Error updating transcoding status for movie ID ${movieId}: ${error.message}`
    );
  }
}
async function updateEpisodeTranscodingStatus(
  episodeId: string,
  data: Partial<EpisodeEntity>
) {
  try {
    const res = await episodeUseCase.updateEpisode(episodeId, data);
    if (res) {
      logger.info(`Transcoding status updated to ${status}`);
      logger.info(res);
    }
  } catch (error: any) {
    logger.error(
      `Error updating transcoding status for movie ID ${episodeId}: ${error.message}`
    );
  }
}

async function handleS3Event(record: any) {
  const { bucket, object } = record.s3;
  const filePath = object.key;
  const fileNameWithExtension = filePath.split("/").pop();

  if (!fileNameWithExtension) {
    logger.error("File name extraction failed.");
    return;
  }

  const movieName = fileNameWithExtension.replace(/\.[^/.]+$/, "");
  const movieId = movieName.split("_")[0];
  logger.info(`Processing movie id: ${movieId}`);
  logger.info(`Processing movie name : ${movieName}`);

  if (movieId) {
    if (mongoose.Types.ObjectId.isValid(movieId)) {
      const movieMetadata = await getMovieMetadata.execute(movieId);
      if (!movieMetadata || !movieMetadata._id || !movieMetadata) {
        logger.info(`Movie not found: ${movieId}`);
        return;
      }

      await updateMovieTranscodingStatus(
        movieMetadata._id.toString(),
        "processing"
      );

      try {
        await processS3Event(
          bucket.name,
          `uploads/${movieId}_video.mp4`,
          movieId,
          movieMetadata._id.toString(),
          movieMetadata
        );
      } catch (error: any) {
        logger.error(
          `Error processing S3 event for movie ${movieId}: ${error.message}`
        );
      }
    } else {
      const episode = await episodeUseCase.getEpisodeByKey(movieId);
      if (!episode) {
        logger.info(`Movie not found: ${movieId}`);
        return;
      }
      updateEpisodeTranscodingStatus(episode.key, {
        transcoding: "processing",
      });
      try {
        await EpisodeProcessS3Event(
          bucket.name,
          `uploads/${movieId}_video.mp4`,
          movieId,
          episode
        );
      } catch (error: any) {
        logger.error(
          `Error processing S3 event for movie ${movieId}: ${error.message}`
        );
        updateEpisodeTranscodingStatus(episode.key, { transcoding: "failed" });
      }
    }
  } else {
    console.log("movieId is not provided");
  }
}

async function consumeSqsMessages() {
  const command = new ReceiveMessageCommand({
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  });

  try {
    while (true) {
      const { Messages } = await sqsClient.send(command);

      if (!Messages || Messages.length === 0) {
        logger.info("No messages available.");
        continue;
      }

      for (const message of Messages) {
        const { Body, ReceiptHandle } = message;

        if (!Body || !ReceiptHandle) {
          logger.error("Invalid message received.");
          continue;
        }

        const event = parseS3Event(Body);

        if (event) {
          for (const record of event.Records) {
            await handleS3Event(record);
          }
        }

        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle,
          })
        );
      }
    }
  } catch (error: any) {
    logger.error(`Error in SQS consumer: ${error.message}`);
  }
}

export { consumeSqsMessages };
