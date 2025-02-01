import {
  DescribeTasksCommand,
  DescribeTasksCommandOutput,
  RunTaskCommand,
} from "@aws-sdk/client-ecs";
import { IEncodedFile, MovieCatalog } from "../domain/entities/VideoCatalog";
import { ecsClient } from "../infrastructure/aws/ecsClient";
import { MovieCatalogRepository } from "../infrastructure/repositories/MovieCatalog"; 
import { EpisodeRepository } from "../infrastructure/repositories/series/EpisodeRepository"; 
import { Types } from "mongoose";
import { VideoMetadataRepository } from "../infrastructure/repositories/VideoMetadataRepository";
import { UpdateTranscodingStatusUseCase } from "./updateMovieTranscodeStatus";
import { logger } from "../infrastructure/logger/logger";
import { MovieProducer } from "../infrastructure/queue/MovieProducer";
import { VideoMetadata } from "../domain/entities/VideoMetadata";
import { EpisodeEntity } from "../domain/entities/series/episodeEntity";
import { EpisodeUseCase } from "./series/EpisodeUseCase";

type TranscodingStatus = "pending" | "processing" | "completed" | "failed";

const repository = new VideoMetadataRepository();
const updateTranscode = new UpdateTranscodingStatusUseCase(repository);
const episodeUseCase = new EpisodeUseCase(new EpisodeRepository());
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
export async function EpisodeProcessS3Event(
  bucketName: string,
  key: string,
  episodeKey: string,
  episode: EpisodeEntity
  // metaDataId: string,
  // movieMetadata: VideoMetadata
) {
  const runTaskCommand = new RunTaskCommand({
    taskDefinition:
      "arn:aws:ecs:us-east-1:235494819343:task-definition/video-transcoder",
    cluster: "arn:aws:ecs:us-east-1:235494819343:cluster/dev",
    launchType: "FARGATE",
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        securityGroups: ["sg-03b8fd0d9bf339e10"],
        subnets: [
          "subnet-040d48e683ba019e8",
          "subnet-0b676c58d4ed22f87",
          "subnet-02f426aca9479f966",
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
            { name: "MOVIE_NAME", value: episodeKey },
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
    if (taskArn) {
      await monitorTaskStatus(taskArn, episode);
    }
  } else {
    console.error("Failed to launch task.");
  }
  console.log(`Triggered ECS task for file: ${key} in bucket: ${bucketName}`);
  console.log("res from contaiern", res);
}

// Function to monitor ECS task status
async function monitorTaskStatus(
  taskArn: string,
  episode: EpisodeEntity
  // movieId: string,
  // title: string,
  // movieMetadata: VideoMetadata
) {
  try {
    const describeTasksCommand = new DescribeTasksCommand({
      cluster: "arn:aws:ecs:us-east-1:235494819343:cluster/dev",
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
      console.log("res>>>>>>", res);

      // Check if res.tasks is defined before accessing it
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
     
      updateEpisodeTranscodingStatus(episode.key,{transcoding:"completed"})
      
    }
  } catch (error) {
    console.error("Error monitoring ECS task:", error);
    updateEpisodeTranscodingStatus(episode.key,{transcoding:"failed"})

  }
}
