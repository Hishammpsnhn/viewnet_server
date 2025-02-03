// src/presentation/controllers/EpisodeController.ts
import { Request, Response } from "express";
import { EpisodeRepository } from "../../../infrastructure/repositories/series/EpisodeRepository";
import { EpisodeUseCase } from "../../../use-cases/series/EpisodeUseCase";
import environment from "../../../infrastructure/config/environment";
import { PresignedUrlParams } from "../../../infrastructure/types/s3Types";
import { GeneratePresignedUrlUseCase } from "../../../use-cases/generatePresignedUrlUseCase";
import { S3Service } from "../../../infrastructure/service/s3Service";
import { ResolutionEntity } from "../../../domain/entities/series/episodeCatalog";

const s3Service = new S3Service();
const episodeUseCase = new EpisodeUseCase(new EpisodeRepository());
const generatePresignedUrlUseCase = new GeneratePresignedUrlUseCase(s3Service);

export class EpisodeController {
  async createEpisodeCatalog(req: Request, res: Response) {
    console.log("createEpisodeCatalog",req.body)
    const { key, episodeId, format } = req.body;
   
    try {
      const episodeCatalog = await episodeUseCase.createEpisodeCatalog(
        episodeId,
        key,
        format
      );
      res.status(201).json({ success: true, data: episodeCatalog });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateSignedUrl(req: Request, res: Response) {
    try {
      const key = Date.now().toString();
      const thumbnailKey = `uploads/thumbnail/${req.body.title
        .replace(/\s+/g, " ")
        .trim()}_thumbnail.jpg`;
      const thumbnailUrl = `https://s3.us-east-1.amazonaws.com/${environment.AWS_BUCKET_NAME}/${thumbnailKey}`;
      const episodeData = req.body;
      const episode = await episodeUseCase.createEpisode({
        ...episodeData,
        key: key,
        thumbnailUrl,
      });
      console.log(episode);

      const expiresIn = 60 * 5; // 5 minutes
      const contentType = "video/mp4";
      const videoKey = `uploads/${key}_video.mp4`;
      const paramsMovie: PresignedUrlParams = {
        Bucket: environment.AWS_BUCKET_NAME as string,
        Key: videoKey,
        Expires: expiresIn,
        ContentType: contentType,
      };
      const paramsThumbnail: PresignedUrlParams = {
        Bucket: environment.AWS_BUCKET_NAME as string,
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
      res
        .status(200)
        .json({ success: true, episode,key, movieSignedUrl, thumbnailSignedUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get episode by ID
  async getEpisodeCatalogById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const episode = await episodeUseCase.getEpisodeCatalogById(id);
      if (episode) {
        res.status(200).json({ success: true, episode });
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getEpisodeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const episode = await episodeUseCase.getEpisodeById(id);
      if (episode) {
        res.status(200).json({ success: true, episode });
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all episodes by season ID
  async getEpisodesBySeasonId(req: Request, res: Response) {
    try {
      const { seasonId } = req.params;
      const episodes = await episodeUseCase.getEpisodesBySeasonId(seasonId);
      res.status(200).json({ success: true, episodes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update episode by ID
  async updateEpisode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const episodeData = req.body;
      const updatedEpisode = await episodeUseCase.updateEpisode(
        id,
        episodeData
      );
      if (updatedEpisode) {
        res.status(200).json({ success: true, updatedEpisode });
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
