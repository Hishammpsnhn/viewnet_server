import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import subscriptionTypeRoute from "../../interface/routes/subscriptionTypeRoutes.js";
import Stripe from "stripe";
import environment from "../config/environment.js";

dotenv.config();
const endpointSecret = environment.STRIPE_WEBHOOK_KEY;
const stripe = new Stripe(environment.STRIPE_SECRET_KEY);

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

  app.use(express.urlencoded({ extended: true }));

  app.use("/webhook", express.raw({ type: "application/json" }));

  // Now apply express.json() globally
  app.use(express.json());

  // Routes
  app.use("/", subscriptionTypeRoute);

  return app;
};

export default createServer;
