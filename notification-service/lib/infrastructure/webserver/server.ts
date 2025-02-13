import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import notificationRoute from '../../interface/routes/NotificationRoutes'
import cors from "cors";
dotenv.config();

const createServer = async () => {
  const app = express();
  const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  async function main() {
    console.log("main")
    app.use("/", notificationRoute);
  }

  main().catch((error) => console.error("Error in application:", error));

 

  return app;
};

export default createServer;
