import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import subscriptionTypeRoute from "../../interface/routes/subscriptionTypeRoutes.js";
import morgan from "morgan";

dotenv.config();

const createServer = async () => {
  const app = express();

  // Middleware setup
  app.use(cookieParser());
  app.use(morgan("combined"));

  app.use("/webhook", express.raw({ type: "application/json" }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Routes
  app.use("/", subscriptionTypeRoute);

  return app;
};

export default createServer;
