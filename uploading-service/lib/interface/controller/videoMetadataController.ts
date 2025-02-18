import { Request, Response } from "express";
import { VideoMetadataRepository } from "../../infrastructure/repositories/VideoMetadataRepository";
import { CreateVideoMetadata } from "../../use-cases/createVideoMetadata";
import { GetAllVideoMetadata } from "../../use-cases/getAllVideoMetadata";
import { GetVideoMetadata } from "../../use-cases/getMetaData";
import { GetLatestVideoMetadata } from "../../use-cases/user/LatestMovies";
import { MovieProducer } from "../../infrastructure/queue/MovieProducer";
import { HttpStatus } from "../HttpStatus";

const repository = new VideoMetadataRepository();

const getVideoMetadata = new GetVideoMetadata(repository);
const createVideoMetadata = new CreateVideoMetadata(repository);
const getAllVideoMetadata = new GetAllVideoMetadata(repository);
const getLatestVideoMetadata = new GetLatestVideoMetadata(repository)
const movieProducer = new MovieProducer();

export class VideoMetadataController {
  static async createMetadata(req: Request, res: Response): Promise<void> {
    try {
      const video = await createVideoMetadata.execute(req.body);
      res.status(HttpStatus.Created).json(video);
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }
  static async getAllMetadata(req: Request, res: Response): Promise<void> {
    try {
      const metaData = await getAllVideoMetadata.execute();
      res.status(HttpStatus.OK).json({ success: true, data: metaData });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }
  static async getMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const metaData = await getVideoMetadata.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data: metaData });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }

  static async getLatestMetadata(req: Request, res: Response): Promise<void> {
    try {
      const metaData = await getLatestVideoMetadata.execute();
      res.status(HttpStatus.OK).json({ success: true, data: metaData });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ message: error.message });
    }
  }
}
