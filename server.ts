import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import recipeRoutes from "./server/routes/recipeRoutes";
import authRoutes from "./server/routes/authRoutes";
import userRoutes from "./server/routes/userRoutes";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://mr-chef-ai-assistant.vercel.app" // Placeholder, user should update with their actual Vercel URL
    ],
    credentials: true
  }));
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
    app.use((req, res) => {
      res.sendFile("dist/index.html", { root: "." }, (err) => {
        if (err) {
          res.status(404).json({ error: "index.html not found. Did you run 'npm run build'?" });
        }
      });
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("💥 Global Error Handler:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });
}

startServer();
