import { config } from "dotenv";
config();
import app from "./app";
import connectDB from "./db/database";
import { initializeRedisClient } from "./services/redis";

(async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await connectDB();
    await initializeRedisClient();
    app.listen(PORT, () => {
      console.log(`🟢 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("🔴 Failed to connect to the database", error);
    process.exit(1);
  }
})();
