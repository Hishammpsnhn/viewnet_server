import { Request } from "express";
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
    console.log(req.file);
    if (!req.file) {
      throw new Error("no file uploaded");
    }
    const params = {
      Bucket: "viewnet.xyz",
      Key: `videos/${Date.now()}_${req.file.originalname}`, // File name in S3
      Body: req.file.buffer, // File content from memory
      ContentType: req.file.mimetype, // File MIME type
    };
    try {
      const data = await s3.upload(params).promise();
      console.log(data);
      //   res.status(200).send({
      //     message: "Video uploaded successfully",
      //     s3Url: data.Location, // S3 file URL
      //   });
      return data;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      //res.status(500).send("Error uploading to S3.");
    }
  }
}
