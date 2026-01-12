import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRouter from "./controller/resumeController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// Fix dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// DB Connect
connectDB();

// Serve uploads (OK on Render, but TEMPORARY storage)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes ONLY
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resume", authMiddleware, resumeRouter);
app.use("/api/v1/upload", uploadRoutes);

// Health check (optional but smart)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
