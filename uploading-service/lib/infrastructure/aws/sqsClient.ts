import { SQSClient } from "@aws-sdk/client-sqs";
import { awsConfig } from "../config/awsConfig2";

export const sqsClient = new SQSClient(awsConfig);
