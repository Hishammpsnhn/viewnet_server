import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { sqsClient } from "../../infrastructure/aws/sqsClient";
import { parseS3Event } from "../../infrastructure/aws/s3EventParser";
import { processS3Event } from "../../use-cases/processS3Event";
import { IEncodedFile, MovieCatalog } from "../../domain/entities/VideoCatalog";
import { Types } from "mongoose";
import { MovieCatalogRepository } from "../../infrastructure/repositories/MovieCatalog";
import { GetVideoMetadata } from "../../use-cases/getMetaDataByName";
import { UpdateTranscodingStatusUseCase } from "../../use-cases/updateMovieTranscodeStatus";
import { VideoMetadataRepository } from "../../infrastructure/repositories/VideoMetadataRepository";
import { format } from "path";
import { logger } from "../../infrastructure/logger/logger"; // Assuming a logger is set up

const QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/235494819343/tempQueeu";
type TranscodingStatus = "pending" | "processing" | "completed" | "failed";

const repository = new VideoMetadataRepository();
const movieCatalogRepository = new MovieCatalogRepository();
const getMovieMetadata = new GetVideoMetadata(repository);
const updateTranscode = new UpdateTranscodingStatusUseCase(repository);

async function updateMovieTranscodingStatus(movieId: string, status: TranscodingStatus) {
  try {
    const res = await updateTranscode.execute(movieId, { status });
    if (res) {
      logger.info(`Transcoding status updated to ${status}`);
    }
  } catch (error:any) {
    logger.error(`Error updating transcoding status for movie ID ${movieId}: ${error.message}`);
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
  const ogMovieName = movieName.split("_")[0];
  logger.info(`Processing movie: ${ogMovieName}`);

  const movieMetadata = await getMovieMetadata.execute(ogMovieName);
  if (!movieMetadata || !movieMetadata._id) {
    logger.info(`Movie not found: ${ogMovieName}`);
    return;
  }

  await updateMovieTranscodingStatus(movieMetadata._id.toString(), "processing");

  try {
    await processS3Event(bucket.name, `uploads/${ogMovieName}_video.mp4`, ogMovieName);

    const movieMetadataUpdate = {
      transcoding: {
        status: "completed" as TranscodingStatus,
        availableResolutions: ["1080p", "720p", "480p", "360p"],
        format: ["mp4"],
      },
    };

    await updateMovieTranscodingStatus(movieMetadata._id.toString(), movieMetadataUpdate.transcoding.status);

    const encodedFiles: IEncodedFile[] = [
      { encodingStatus: "completed", fileUrl: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${ogMovieName}/1080p/index.m3u8`, format: "mp4", resolution: "1080p" },
      { encodingStatus: "completed", fileUrl: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${ogMovieName}/master.m3u8`, format: "mp4", resolution: "auto" },
      { encodingStatus: "completed", fileUrl: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${ogMovieName}/720p/index.m3u8`, format: "mp4", resolution: "720p" },
      { encodingStatus: "completed", fileUrl: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${ogMovieName}/480p/index.m3u8`, format: "mp4", resolution: "480p" },
      { encodingStatus: "completed", fileUrl: `https://s3.us-east-1.amazonaws.com/production.viewnet.xyz/hls/${ogMovieName}/360p/index.m3u8`, format: "mp4", resolution: "360p" },
    ];

    const newCatalog = new MovieCatalog(
      new Types.ObjectId().toHexString(),
      encodedFiles,
      ogMovieName,
      movieMetadata._id.toString(),
    );

console.log(newCatalog);
    await movieCatalogRepository.create(newCatalog);
    logger.info(`Created catalog entry for movie: ${ogMovieName}`);
  } catch (error:any) {
    logger.error(`Error processing S3 event for movie ${ogMovieName}: ${error.message}`);
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
  } catch (error:any) {
    logger.error(`Error in SQS consumer: ${error.message}`);
  }
}

export { consumeSqsMessages };