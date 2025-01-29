// src/presentation/controllers/SeriesController.ts
import { Request, Response } from "express";
import { SeriesRepository } from "../../../infrastructure/repositories/series/SeriesRepository";
import { SeriesUseCase } from "../../../use-cases/series/SeriesUseCase";

const seriesUseCase = new SeriesUseCase(new SeriesRepository());

export class SeriesController {
  // Create a new series
  async createSeries(req: Request, res: Response) {
    try {
      const seriesData = req.body; // Assuming the request body contains series data
      const series = await seriesUseCase.createSeries(seriesData);
      res.status(201).json(series);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get series by ID
  async getSeriesById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const series = await seriesUseCase.getSeriesById(id);
      if (series) {
        res.status(200).json(series);
      } else {
        res.status(404).json({ message: "Series not found" });
      }
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all series
  async getAllSeries(req: Request, res: Response) {
    try {
      const series = await seriesUseCase.getAllSeries();
      res.status(200).json(series);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update series by ID
  async updateSeries(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const seriesData = req.body;
      const updatedSeries = await seriesUseCase.updateSeries(id, seriesData);
      if (updatedSeries) {
        res.status(200).json(updatedSeries);
      } else {
        res.status(404).json({ message: "Series not found" });
      }
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete series by ID
  async deleteSeries(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await seriesUseCase.deleteSeries(id);
      if (success) {
        res.status(200).json({ message: "Series deleted successfully" });
      } else {
        res.status(404).json({ message: "Series not found" });
      }
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
}
