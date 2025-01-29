import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import subscriptionTypeRoute from "../../interface/routes/subscriptionTypeRoutes.js";

// import { isAuthenticated } from '../../interfaces/controllers/AuthMiddleware.js';

dotenv.config();

const createServer = async (metricsService) => {
  const app = express();
  const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };

  // Middleware setup
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Metrics setup
  // metricsService.setup(app);

  // Routes
  app.use("/", subscriptionTypeRoute);

  return app;
};

export default createServer;
