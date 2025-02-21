import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import seriesRoutes from "../../interface/routes/seriesRoutes";
import movieRoutes from "../../interface/routes/movieRoutes";
import historyRoute from "../../interface/routes/watchHistoryRoutes";
import { logger } from "../../infrastructure/logger/logger";
import morgan from 'morgan'
dotenv.config();

const createServer = async () => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  async function main() {
   
  }

  main().catch((error) => console.error("Error in application:", error));
  app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));

  // Routes
  app.use("/series", seriesRoutes);
  app.use("/movies", movieRoutes);
  app.use("/history", historyRoute);

  return app;
};

export default createServer;
