import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import recipeRoutes from "./server/routes/recipeRoutes";
import authRoutes from "./server/routes/authRoutes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";
  const clientOptions = { serverApi: { version: '1' as const, strict: true, deprecationErrors: true } };

  try {
    mongoose.set('strictQuery', false);
    console.log("Connecting to MongoDB Atlas with Stable API...");
    await mongoose.connect(mongoUri, clientOptions);
    
    // Ping the deployment to confirm connection
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
  } catch (err: any) {
    console.error("CRITICAL: MongoDB connection error details:");
    console.error(err);
    process.exit(1);
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/recipes", recipeRoutes);
  app.use("/api/auth", authRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
