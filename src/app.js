import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRouter from "./controller/resumeController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";



const app = express();

app.use(cors());
app.use(bodyParser.json());
connectDB();
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resume",authMiddleware, resumeRouter);
      
app.use("/api/v1/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Resume AI Backend (Node.js) is running ✅" });
});

export default app;
