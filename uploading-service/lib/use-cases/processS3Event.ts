import {
  DescribeTasksCommand,
  DescribeTasksCommandOutput,
  RunTaskCommand,
} from "@aws-sdk/client-ecs";
import { IEncodedFile, MovieCatalog } from "../domain/entities/VideoCatalog";
import { ecsClient } from "../infrastructure/aws/ecsClient";
import { MovieCatalogRepository } from "../infrastructure/repositories/MovieCatalog"; 
import { Types } from "mongoose";
import { VideoMetadataRepository } from "../infrastructure/repositories/VideoMetadataRepository";
import { UpdateTranscodingStatusUseCase } from "./updateMovieTranscodeStatus";
import { logger } from "../infrastructure/logger/logger";
import { VideoMetadata } from "../domain/entities/VideoMetadata";
import env from '../infrastructure/config/environment'

type TranscodingStatus = "pending" | "processing" | "completed" | "failed";

const repository = new VideoMetadataRepository();
const updateTranscode = new UpdateTranscodingStatusUseCase(repository);
const movieCatalogRepository = new MovieCatalogRepository();
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
export async function processS3Event(
  bucketName: string,
  key: string,
  title: string,
  metaDataId: string,
  movieMetadata: VideoMetadata
) {
  const runTaskCommand = new RunTaskCommand({
    taskDefinition:
      "arn:aws:ecs:eu-north-1:423623873639:task-definition/video-transcoder",
    cluster: "arn:aws:ecs:eu-north-1:423623873639:cluster/dev_cluster",
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        securityGroups: ["sg-05eed8e4e6078a76c"],
        subnets: [
          "subnet-0188ff1191607015a",
          "subnet-0f7b1d9ab621a5ada",
          "subnet-0805caf60cd292fad",
        ],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "video-transcoder",
          environment: [
            { name: "BUCKET_NAME", value: bucketName },
            { name: "KEY", value: key },
            { name: "MOVIE_NAME", value: title },
          ],
        },
      ],
    },
  });

  // Trigger ECS task
  const res = await ecsClient.send(runTaskCommand);

  if (res.tasks && res.tasks.length > 0) {
    const taskArn = res.tasks[0].taskArn;
    console.log(`New task launched with ARN: ${taskArn}`);

    // Step 2: Monitor the status of the new task
    if (taskArn)
      await monitorTaskStatus(taskArn, metaDataId, title);
  } else {
    console.error("Failed to launch task.");
  }
  console.log(`Triggered ECS task for file: ${key} in bucket: ${bucketName}`);

}

// Function to monitor ECS task status
async function monitorTaskStatus(
  taskArn: string,
  movieId: string,
  title: string,
) {
  try {
    const describeTasksCommand = new DescribeTasksCommand({
      cluster: "arn:aws:ecs:eu-north-1:423623873639:cluster/dev_cluster",
      tasks: [taskArn],
    });

    // Poll for task status
    let taskStatus = "PROVISIONING";
    while (
      taskStatus === "PROVISIONING" ||
      taskStatus === "PENDING" ||
      taskStatus === "RUNNING"
    ) {
      const res: DescribeTasksCommandOutput = await ecsClient.send(
        describeTasksCommand
      );

      const task = res.tasks?.[0];
      if (!task) {
        console.error("No task found in the response.");
        return;
      }
      if (task.lastStatus) taskStatus = task.lastStatus;
      console.log(`Current task status: ${taskStatus}`);

      // Wait before polling again (e.g., 10 seconds)
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    // Update movie status based on task completion
    if (
      taskStatus === "STOPPED" ||
      taskStatus === "COMPLETED" ||
      taskStatus === "DEPROVISIONING"
    ) {
      console.log(`Task completed successfully: ${taskArn}`);
      const encodedFiles: IEncodedFile[] = [
        {
          encodingStatus: "completed",
          fileUrl: `https://${env.CLOUDFRONT_KEY}.cloudfront.net/hls/${title}/1080p/index.m3u8`,
          format: "mp4",
          resolution: "1080p",
        },
        {
          encodingStatus: "completed",
          fileUrl: `https://${env.CLOUDFRONT_KEY}.cloudfront.net/hls/${title}/master.m3u8`,
          format: "mp4",
          resolution: "auto",
        },
        {
          encodingStatus: "completed",
          fileUrl: `https://${env.CLOUDFRONT_KEY}.cloudfront.net/hls/${title}/720p/index.m3u8`,
          format: "mp4",
          resolution: "720p",
        },
        {
          encodingStatus: "completed",
          fileUrl: `https://${env.CLOUDFRONT_KEY}.cloudfront.net/hls/${title}/480p/index.m3u8`,
          format: "mp4",
          resolution: "480p",
        },
        {
          encodingStatus: "completed",
          fileUrl: `https://${env.CLOUDFRONT_KEY}.cloudfront.net/hls/${title}/360p/index.m3u8`,
          format: "mp4",
          resolution: "360p",
        },
      ];

      await updateMovieTranscodingStatus(movieId, "completed");
      const newCatalog = new MovieCatalog(
        new Types.ObjectId().toHexString(),
        encodedFiles,
        title,
        movieId
      );
      await movieCatalogRepository.create(newCatalog);
      logger.info(`Created catalog entry for movie: ${title}`);
      
    }
  } catch (error) {
    console.error("Error monitoring ECS task:", error);
    await updateMovieTranscodingStatus(movieId, "failed");
  }
}
