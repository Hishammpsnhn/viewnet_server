// src/presentation/controllers/SeasonController.ts
import { Request, Response } from "express";
import { SeasonRepository } from "../../../infrastructure/repositories/series/SeasonRepository";
import { SeasonUseCase } from "../../../use-cases/series/SeasonUseCase";
import { SeriesRepository } from "../../../infrastructure/repositories/series/SeriesRepository";
import { SeriesUseCase } from "../../../use-cases/series/SeriesUseCase";
import { HttpStatus } from "../../HttpStatus";

const seasonUseCase = new SeasonUseCase(
  new SeasonRepository(),
  new SeriesRepository()
);

export class SeasonController {
  // Create a new season
  async createSeason(req: Request, res: Response) {
    try {
      const seasonData = req.body;
      const seriesId = req.params.seriesId;
      if (!seriesId) {
        throw new Error(` series id required`);
      }
      const season = await seasonUseCase.createSeason(seriesId, seasonData);
      res
        .status(HttpStatus.Created)
        .json({ success: true, message: "Season added successfully", season });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Get season by ID
  async getSeasonById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const season = await seasonUseCase.getSeasonById(id);
      if (season) {
        res.status(HttpStatus.OK).json(season);
      } else {
        res.status(HttpStatus.BadRequest).json({ success: true, message: "Season not found" });
      }
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Get all seasons by series ID
  async getSeasonsBySeriesId(req: Request, res: Response) {
    try {
      const { seriesId } = req.params;
      const seasons = await seasonUseCase.getSeasonsBySeriesId(seriesId);
      res.status(HttpStatus.OK).json({ success: true, data: seasons });
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Update season by ID
  async updateSeason(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const seasonData = req.body;
      const updatedSeason = await seasonUseCase.updateSeason(id, seasonData);
      if (updatedSeason) {
        res.status(HttpStatus.OK).json(updatedSeason);
      } else {
        res.status(HttpStatus.BadRequest).json({  message: "Season not found" });
      }
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }

  // Delete season by ID
  async deleteSeason(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await seasonUseCase.deleteSeason(id);
      if (success) {
        res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Season deleted successfully" });
      } else {
        res.status(HttpStatus.BadRequest).json({ message: "Season not found" });
      }
    } catch (error: any) {
      res.status(HttpStatus.InternalServerError).json({ error: error.message });
    }
  }
}
