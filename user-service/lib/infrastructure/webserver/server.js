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
  
  // Add request logging middleware
  app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming request: ${req.method} ${req.originalUrl}`);
    next();
  });
  
  
  app.use(morgan("combined"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Mount routes without the /api/user prefix
  app.use('/profile',profileRoutes)
  app.use("/", authRoutes);
  
  // Add catch-all route for debugging
  app.use('*', (req, res) => {
    console.log(`[DEBUG] No route matched: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method 
    });
  });
  
  return app;
};

export default createServer;
