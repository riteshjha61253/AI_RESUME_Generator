import express from "express";
import { generateResumeResponse } from "../services/resumeService.js";

const router = express.Router();

/**
 * POST /api/v1/resume/generate
 * Body: { userDescription: "short paragraph or key info" }
 */
router.post("/generate", async (req, res) => {
  try {
    const { userDescription } = req.body;
    if (!userDescription)
      return res.status(400).json({ error: "userDescription is required" });

    const result = await generateResumeResponse(userDescription);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error generating resume:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
