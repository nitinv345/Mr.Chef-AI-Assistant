import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./server/routes/recipeRoutes";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr-chief";
  const clientOptions = { serverApi: { version: '1' as const, strict: true, deprecationErrors: true } };
  try {
    await mongoose.connect(mongoUri, clientOptions);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/recipes", recipeRoutes);

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
