import AWS from "aws-sdk";
import dotenv from 'dotenv';
import environment from "./environment";
dotenv.config();

const s3 = new AWS.S3({
  region: environment.AWS_REGION,
  accessKeyId: environment.AWS_ACCESS_KEY_ID,
  secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
});

export default s3;
