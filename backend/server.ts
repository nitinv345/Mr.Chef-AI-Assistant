import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // CORS — allow requests from the frontend
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  app.use(
    cors({
      origin: [FRONTEND_URL, "http://localhost:5173"],
      credentials: true,
    })
  );

  app.use(express.json());

  // MongoDB Connection
  const mongoUri =
    process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";
  const clientOptions = {
    serverApi: {
      version: "1" as const,
      strict: true,
      deprecationErrors: true,
    },
  };

  try {
    mongoose.set("strictQuery", false);
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri, clientOptions);

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("✅ MongoDB Connected. Ping successful!");
    }
  } catch (err: any) {
    console.error("CRITICAL: MongoDB connection error:", err);
    process.exit(1);
  }

  // Root Route
  app.get("/", (_req, res) => {
    res.send("Mr Chef AI API running ✅");
  });

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API Routes
  app.use("/api/recipes", recipeRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  // 404 fallback for unknown /api routes
  app.use("/api", (req, res) => {
    res
      .status(404)
      .json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
