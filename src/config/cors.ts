import { config } from "dotenv";
config();

export interface CorsOptions {
  origin: string[];
  credentials: boolean;
}

interface Config {
  corsOptions: CorsOptions;
  databaseURI: string | undefined;
  redisURI: string | undefined;
  port: string | number;
  apiKey: string | undefined;
  appSecret: string | undefined;
}

interface Configs {
  development: Config;
  production: Config;
}

const configs: Configs = {
  development: {
    corsOptions: {
      origin: [
        "http://localhost:3005",
        "http://localhost:3000",
        "http://192.168.66.116:3000",
        process.env.CORS_ORIGINS || "",
        "*"
      ],
      credentials: true
    },
    databaseURI: process.env.DEV_DATABASE_URL,
    redisURI: process.env.DEV_REDIS_URI,
    port: process.env.PORT || 8000,
    apiKey: process.env.API_KEY,
    appSecret: process.env.APP_SECRET
  },
  production: {
    corsOptions: {
      origin: [process.env.CORS_ORIGINS || ""],
      credentials: true
    },
    databaseURI: process.env.PROD_DATABASE_URL,
    redisURI: process.env.PROD_REDIS_URI,
    port: process.env.PORT || 8000,
    apiKey: process.env.API_KEY,
    appSecret: process.env.APP_SECRET
  }
};

export default configs;
