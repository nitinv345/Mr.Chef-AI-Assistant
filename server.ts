import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import recipeRoutes from "./server/routes/recipeRoutes";
import authRoutes from "./server/routes/authRoutes";
import userRoutes from "./server/routes/userRoutes";

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

  // Root Route
  app.get("/", (req, res) => {
    res.send("Mr Chef AI API running");
  });

  // API Routes
  app.use("/api/recipes", recipeRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Bind to port immediately for Render
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  // MongoDB Connection (Asynchronous)
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";
  const clientOptions = { serverApi: { version: '1' as const, strict: true, deprecationErrors: true } };

  mongoose.set('strictQuery', false);
  console.log("Connecting to MongoDB Atlas...");
  
  mongoose.connect(mongoUri, clientOptions)
    .then(async () => {
      console.log("✅ MongoDB Connected");
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Ping successful!");
      }
    })
    .catch(err => {
      console.error("❌ MongoDB connection error:", err.message);
    });

  // API 404 Handler (This will catch any /api/* requests that didn't match)
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠 Running in DEVELOPMENT mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Running in PRODUCTION mode");
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
