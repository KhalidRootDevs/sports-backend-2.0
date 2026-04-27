import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import router from "./router";
import { redisCachingMiddleware } from "./services/redis";
import { monksFootballV3Data } from "./features/sportsMonk/services";
import { errorMiddleware, loggerMiddleware, notFoundMiddleware } from "./utils/logger";
import configs from "./config/cors";

const app: Application = express();
const env = process.env.NODE_ENV || "development";

// @ts-ignore
const corsOptions: CorsOptions = configs[env].corsOptions;

// Middleware
app.use(cors(corsOptions));
app.use(loggerMiddleware);
app.use(express.json());
app.use(cookieParser());

// Root Route
app.get("/", (req: Request, res: Response) => {
  const welcomeMessage = {
    message: "Welcome to our Football Platform!",
    description: "Connecting you with the best football insights, live scores, and updates.",
    serverTime: new Date().toISOString(),
    funFact:
      "Did you know? The fastest goal in football history was scored just 2.4 seconds after kickoff by Ricardo Oliveira in 1998!"
  };

  res.json(welcomeMessage);
});

// API Routes
app.use("/api", router);
// Sports routes
app.get("/football/v3/*", redisCachingMiddleware(), monksFootballV3Data);
// 404 Routes
app.use(notFoundMiddleware);
// Error middleware
app.use(errorMiddleware);

export default app;
