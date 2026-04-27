import { NextFunction, Request, Response } from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import winston from "winston";
import { ZodError } from "zod";

// Ensure log directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure Winston
const transportConsole = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple())
});

const transportFile = new winston.transports.File({
  filename: path.join(logDir, "errors.log"),
  level: "error",
  format: winston.format.json()
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [transportConsole, transportFile]
});

// Morgan configuration
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

const loggerMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
});

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
};

// Custom error logging middleware
const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    // Handle Zod validation errors
    const errors = err.errors.map((error) => ({
      path: error.path,
      message: error.message,
      code: error.code
    }));

    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors
    });
  }

  if (process.env.NODE_ENV === "production") {
    logger.error(`${err.status || 500} - ${err.message}`);
  } else {
    console.error(err);
  }

  res.status(err.status || 500).json({
    status: false,
    message: err.message || "Internal Server Error"
  });
};

export { errorMiddleware, logger, loggerMiddleware, notFoundMiddleware };
