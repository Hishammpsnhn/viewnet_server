import AWS from "aws-sdk";
import environment from "../config/environment";

AWS.config.update({
  accessKeyId: environment.AWS_ACCESS_KEY_ID,
  secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
  region: environment.AWS_REGION,
});

const s3 = new AWS.S3();

export class VideoService {
  async uploadVideo(req: any) {
    if (!req.file) {
      throw new Error("no file uploaded");
    }
    const params = {
      Bucket: environment.AWS_BUCKET_NAME as string,
      Key: `videos/${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    try {
      const data = await s3.upload(params).promise();
      return data;
    } catch (error) {
      console.error("Error uploading to S3:", error);
    }
  }
}
