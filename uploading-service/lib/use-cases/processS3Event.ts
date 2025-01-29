import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { IEncodedFile, MovieCatalog } from "../domain/entities/VideoCatalog";
import { ecsClient } from "../infrastructure/aws/ecsClient";
import { MovieCatalogRepository } from "../infrastructure/repositories/MovieCatalog"; // Import the repository
import { Types } from "mongoose";

const movieCatalogRepository = new MovieCatalogRepository(); // Initialize the repository

export async function processS3Event(
  bucketName: string,
  key: string,
  title: string
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
            { name: "MOVIE_NAME", value: title },
          ],
        },
      ],
    },
  });

  // Trigger ECS task
  const res = await ecsClient.send(runTaskCommand);
  console.log(`Triggered ECS task for file: ${key} in bucket: ${bucketName}`);
  console.log("res from contaiern", res);

}
