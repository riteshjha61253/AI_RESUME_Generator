import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (_, res) => {
  res.status(200).json({ message: "Resume AI Backend (Node.js) is running ✅" });
});

// ✅ Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Resume generation route
app.post("/api/generate", async (req, res) => {
  try {
    const { name, title, summary = "", skills = [] } = req.body;
    if (!name || !title) {
      return res.status(400).json({ error: "Name and title are required." });
    }

    const prompt = `
Create a professional résumé in plain Markdown format.
Name: ${name}
Title: ${title}
Summary: ${summary}
Skills: ${skills.join(", ")}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const markdown = result.text || "";
    res.json({ markdown });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Resume AI Backend running on http://localhost:${PORT}`)
);
