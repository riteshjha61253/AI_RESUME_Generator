import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import resumeRouter from "./controller/resumeController.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/resume", resumeRouter);

app.get("/", (req, res) => {
  res.json({ message: "Resume AI Backend (Node.js) is running ✅" });
});

export default app;
