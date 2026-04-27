import { config } from "dotenv";
config();

import mongoose from "mongoose";

const mongoURI = process.env.DEV_DATABASE_URL || "mongodb://localhost:27017/my-project";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("🌱 MongoDB connected successfully");
  } catch (error) {
    console.error("❗ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
