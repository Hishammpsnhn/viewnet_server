import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import videoMetadataRoutes from "../../interface/routes/videoMetadataRoutes";
import genreRoutes from "../../interface/routes/genreRoutes";
import seriesRoutes from "../../interface/routes/seriesRoutes";
import { consumeSqsMessages } from "../../interface/consumers/sqsConsumer";
import morgan from 'morgan'

dotenv.config();

const createServer = async () => {
  const app = express();
  app.use(morgan("combined"))

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  async function main() {
    console.log("Starting SQS consumer...");
    await consumeSqsMessages();
  }

  main().catch((error) => console.error("Error in application:", error));

  // Routes
  app.use("/", seriesRoutes);
  app.use("/movies", videoMetadataRoutes);
  app.use("/genre",genreRoutes );

  return app;
};

export default createServer;
