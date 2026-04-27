import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import webRouter from "./router/webRoutes";
import proxyRouter from "./router/proxyRoutes";
import mobileRouter from "./router/mobileRoutes";
import { errorMiddleware, loggerMiddleware, notFoundMiddleware } from "./utils/logger";
import configs from "./config/cors";
import userIpMiddleware from "./middlewares/userIP";

const app: Application = express();
const env = process.env.NODE_ENV || "development";

// @ts-ignore
const corsOptions: CorsOptions = configs[env].corsOptions;

// Middleware
app.use(cors(corsOptions));
app.use(loggerMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(userIpMiddleware);

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
app.use("/api/web", webRouter);
app.use("/api/mobile", mobileRouter);
app.use("/api/sports", proxyRouter);

// 404 Routes
app.use(notFoundMiddleware);
// Error middleware
app.use(errorMiddleware);

export default app;
