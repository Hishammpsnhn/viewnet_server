import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import notificationRoute from "../../interface/routes/NotificationRoutes";
import watchTimeRoute from "../../interface/routes/WatchTimeRoute";
import cors from "cors";
import environment from "../config/environment";
import morgan from 'morgan'
dotenv.config();

const createServer = async () => {
  const app = express();
  const corsOptions = {
    origin: [
      environment.CLIENT_URL as string,
      environment.GATEWAY_URL as string,
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };

  app.use(morgan("combined"))

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  async function main() {
    app.use("/watchTime", watchTimeRoute);
    app.use("/", notificationRoute);
  }

  main().catch((error) => console.error("Error in application:", error));

  return app;
};

export default createServer;
