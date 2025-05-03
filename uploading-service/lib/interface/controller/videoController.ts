import { Request, Response } from "express";
import { PresignedUrlParams } from "../../infrastructure/types/s3Types";
import { GeneratePresignedUrlUseCase } from "../../use-cases/generatePresignedUrlUseCase";
import { S3Service } from "../../infrastructure/service/s3Service";
import env from "../../infrastructure/config/environment";
import { VideoMetadataRepository } from "../../infrastructure/repositories/VideoMetadataRepository";
import { CreateVideoMetadata } from "../../use-cases/createVideoMetadata";
import { UpdateVideoMetadataUseCase } from "../../use-cases/updateMetadata";
import { HttpStatus } from "../HttpStatus";

const s3Service = new S3Service();
const repository = new VideoMetadataRepository();

const generatePresignedUrlUseCase = new GeneratePresignedUrlUseCase(s3Service);
const createVideoMetadata = new CreateVideoMetadata(repository);
const updateVideoMetadata = new UpdateVideoMetadataUseCase(repository);
export class VideoController {
  static async generatePresignedUrl(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const thumbnailKey = `uploads/thumbnail/${req.body.title.replace(/\s+/g, " ").trim()}_thumbnail.jpg`;
      const thumbnailUrl = `https://s3.eu-north-1.amazonaws.com/${env.AWS_BUCKET_NAME}/${thumbnailKey}`;
      const metaData = await createVideoMetadata.execute({
        ...req.body,
        thumbnailUrl,
      });
      const expiresIn = 60 * 5; // 5 minutes
      const contentType = "video/mp4";
      const videoKey = `uploads/${metaData._id}_video.mp4`;
      const paramsMovie: PresignedUrlParams = {
        Bucket: env.AWS_BUCKET_NAME as string,
        Key: videoKey,
        Expires: expiresIn,
        ContentType: contentType,
      };

      const paramsThumbnail: PresignedUrlParams = {
        Bucket: env.AWS_BUCKET_NAME as string,
        Key: thumbnailKey,
        Expires: expiresIn,
        ContentType: req.body.thumbnailContentType || "image/jpeg",
      };

      const movieSignedUrl = await generatePresignedUrlUseCase.execute(
        paramsMovie
      );
      const thumbnailSignedUrl = await generatePresignedUrlUseCase.execute(
        paramsThumbnail
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: metaData,
        signedUrls: { movieSignedUrl, thumbnailSignedUrl },
      });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }

  static async updateThumbnail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; 
      const { thumbnailContentType, title } = req.body; 

      // Generate a new pre-signed URL for the thumbnail upload
      const expiresIn = 60 * 5; // 5 minutes
      const thumbnailKey = `uploads/thumbnail/${title}_thumbnail.jpg`; 
      const paramsThumbnail: PresignedUrlParams = {
        Bucket: env.AWS_BUCKET_NAME as string,
        Key: thumbnailKey,
        Expires: expiresIn,
        ContentType: thumbnailContentType || "image/jpeg",
      };

      // Generate the signed URL for the new thumbnail
      const thumbnailSignedUrl = await generatePresignedUrlUseCase.execute(
        paramsThumbnail
      );

      // Update the movie metadata with the new thumbnail URL
      const newThumbnailUrl = `https://s3.eu-north-1.amazonaws.com/${env.AWS_BUCKET_NAME}/${thumbnailKey}`;
      const updatedVideo = await updateVideoMetadata.execute(id, {
        thumbnailUrl: newThumbnailUrl, 
      });

      if (!updatedVideo) {
        res.status(HttpStatus.BadRequest).json({ message: "Video not found" });
        return;
      }

      res.status(HttpStatus.Created).json({
        success: true,
        message: "Thumbnail updated successfully",
        data: updatedVideo,
        signedUrl: thumbnailSignedUrl, 
      });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }

  static async updateVideoMetadataUseCase(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedVideo = await updateVideoMetadata.execute(id, data);
      if (!updatedVideo) {
        res.status(HttpStatus.BadRequest).json({ message: "Video not found" });
      }
      res.status(HttpStatus.OK).json({ success: true, data: updatedVideo });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }
}
