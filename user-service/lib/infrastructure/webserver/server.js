import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../../interface/routes/authRoutes.js";
import profileRoutes from '../../interface/routes/profileRoutes.js';
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
  metricsService.setup(app);

  // Routes
  app.use("/", authRoutes);
  app.use('/',  profileRoutes);

  return app;
};

export default createServer;
