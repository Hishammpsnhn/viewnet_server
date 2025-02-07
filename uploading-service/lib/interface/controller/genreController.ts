import { Request, Response } from "express";
import { CreateGenreUseCase } from "../../use-cases/genre/createGenre";
import { GetAllGenreUseCase } from "../../use-cases/genre/getAllGenre";
import { genreRepository } from "../../infrastructure/repositories/genreRepository";
import { Genre } from "../../domain/entities/genre";

export class GenreController {
  private createGenreUseCase: CreateGenreUseCase;
  private getGenreByIdUseCase: GetAllGenreUseCase;

  constructor() {
    this.createGenreUseCase = new CreateGenreUseCase(genreRepository);
    this.getGenreByIdUseCase = new GetAllGenreUseCase(genreRepository);
  }

  async createGenre(req: Request, res: Response): Promise<void> {
    try {
      const { name, description,id ,isActive} = req.body;
      const createdGenre = await this.createGenreUseCase.execute({
        id,
        name,
        description,
        isActive,
      });
      res.status(201).json({ success: true, data:createdGenre });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const genre = await this.getGenreByIdUseCase.execute();

      if (!genre) {
        res.status(404).json({ message: "Genre not found" });
      }

      res.status(200).json({ success: true, data:genre });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
