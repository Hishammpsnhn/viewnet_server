import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../../interface/routes/authRoutes.js";
import profileRoutes from "../../interface/routes/profileRoutes.js";
import morgan from "morgan";
dotenv.config();

const createServer = async (metricsService) => {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:5173", "http://viewnet.cfd"],
      methods: "GET,POST,PUT,DELETE,OPTIONS",
      credentials: true,
    })
  );
  app.use(morgan("combined"));

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Metrics setup
  //metricsService.setup(app);

  // Routes

  app.use("/api/user", authRoutes);
  // app.use("/api/user", profileRoutes);

  return app;
};

export default createServer;
