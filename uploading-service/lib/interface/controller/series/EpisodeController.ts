// src/presentation/controllers/EpisodeController.ts
import { Request, Response } from "express";
import { EpisodeRepository } from "../../../infrastructure/repositories/series/EpisodeRepository";
import { EpisodeUseCase } from "../../../use-cases/series/EpisodeUseCase";

const episodeUseCase = new EpisodeUseCase(new EpisodeRepository());

export class EpisodeController {
  // Create a new episode
  async createEpisode(req: Request, res: Response) {
    try {
      const episodeData = req.body; // Assuming the request body contains episode data
      const episode = await episodeUseCase.createEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get episode by ID
  async getEpisodeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const episode = await episodeUseCase.getEpisodeById(id);
      if (episode) {
        res.status(200).json(episode);
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all episodes by season ID
  async getEpisodesBySeasonId(req: Request, res: Response) {
    try {
      const { seasonId } = req.params;
      const episodes = await episodeUseCase.getEpisodesBySeasonId(seasonId);
      res.status(200).json(episodes);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update episode by ID
  async updateEpisode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const episodeData = req.body;
      const updatedEpisode = await episodeUseCase.updateEpisode(id, episodeData);
      if (updatedEpisode) {
        res.status(200).json(updatedEpisode);
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete episode by ID
  async deleteEpisode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await episodeUseCase.deleteEpisode(id);
      if (success) {
        res.status(200).json({ message: "Episode deleted successfully" });
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
}
