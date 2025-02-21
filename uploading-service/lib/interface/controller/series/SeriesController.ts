// src/presentation/controllers/SeriesController.ts
import { Request, Response } from "express";
import { SeriesRepository } from "../../../infrastructure/repositories/series/SeriesRepository";
import { SeriesUseCase } from "../../../use-cases/series/SeriesUseCase";
import environment from "../../../infrastructure/config/environment";
import { PresignedUrlParams } from "../../../infrastructure/types/s3Types";
import { S3Service } from "../../../infrastructure/service/s3Service";
import { GeneratePresignedUrlUseCase } from "../../../use-cases/generatePresignedUrlUseCase";
import { HttpStatus } from "../../HttpStatus";

const seriesUseCase = new SeriesUseCase(new SeriesRepository());
const generatePresignedUrlUseCase = new GeneratePresignedUrlUseCase(
  new S3Service()
);
export class SeriesController {
  // Create a new series
  async createSeries(req: Request, res: Response) {
    try {
      const seriesData = req.body;
      const thumbnailKey = `uploads/thumbnail/${req.body.title
        .replace(/\s+/g, " ")
        .trim()}_thumbnail.jpg`;
      const thumbnailUrl = `https://s3.us-east-1.amazonaws.com/${environment.AWS_BUCKET_NAME}/${thumbnailKey}`;
      const expiresIn = 60 * 5;
      const paramsThumbnail: PresignedUrlParams = {
        Bucket: environment.AWS_BUCKET_NAME as string,
        Key: thumbnailKey,
        Expires: expiresIn,
        ContentType: req.body.thumbnailContentType || "image/jpeg",
      };
      const thumbnailSignedUrl = await generatePresignedUrlUseCase.execute(
        paramsThumbnail
      );
      const series = await seriesUseCase.createSeries({
        ...seriesData,
        posterImage: thumbnailUrl,
      });
      res.status(HttpStatus.Created).json({ success: true, data: series, thumbnailSignedUrl });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Get series by ID
  async getSeriesById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const series = await seriesUseCase.getSeriesById(id);
      if (series) {
        res.status(HttpStatus.OK).json({ success: true, data: series });
      } else {
        res.status(HttpStatus.BadRequest).json({ message: "Series not found" });
      }
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Get all series
  async getAllSeries(req: Request, res: Response) {
    try {
      const series = await seriesUseCase.getAllSeries();
      res.status(HttpStatus.OK).json({ success: true, data: series });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Update series by ID
  async updateSeries(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const seriesData = req.body;
      const updatedSeries = await seriesUseCase.updateSeries(id, seriesData);
      if (updatedSeries) {
        res.status(HttpStatus.OK).json({ success: true, data: updatedSeries });
      } else {
        res.status(HttpStatus.BadRequest).json({ message: "Series not found" });
      }
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Delete series by ID
  async deleteSeries(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await seriesUseCase.deleteSeries(id);
      if (success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res.status(HttpStatus.BadRequest).json({ message: "Series not found" });
      }
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }
}
