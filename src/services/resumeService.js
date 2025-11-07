import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { loadPromptFromFile, putValuesToTemplate } from "./utils.js";

dotenv.config();

// === Normalization (same as before) ===
function normalizeResumeData(data) {
  const safeArray = (arr, shape) =>
    Array.isArray(arr) && arr.length > 0 ? arr : [shape];

  return {
    personalInformation: {
      fullName: data?.personalInformation?.fullName || "",
      email: data?.personalInformation?.email || "",
      phoneNumber: data?.personalInformation?.phoneNumber || "",
      location: data?.personalInformation?.location || "",
      linkedIn: data?.personalInformation?.linkedIn || "",
      gitHub: data?.personalInformation?.gitHub || "",
      portfolio: data?.personalInformation?.portfolio || "",
    },
    summary: data?.summary || "",
    skills: safeArray(data?.skills, { title: "", level: "" }),
    experience: safeArray(data?.experience, {
      jobTitle: "",
      company: "",
      location: "",
      duration: "",
      responsibility: "",
    }),
    education: safeArray(data?.education, {
      degree: "",
      university: "",
      location: "",
      graduationYear: "",
    }),
    certifications: safeArray(data?.certifications, {
      title: "",
      issuingOrganization: "",
      year: "",
    }),
    projects: safeArray(data?.projects, {
      title: "",
      description: "",
      technologiesUsed: [""],
      githubLink: "",
    }),
    achievements: safeArray(data?.achievements, {
      title: "",
      year: "",
      extraInformation: "",
    }),
    languages: safeArray(data?.languages, { name: "" }),
    interests: safeArray(data?.interests, { name: "" }),
  };
}

export async function generateResumeResponse(userResumeDescription) {
  try {
    const template = await loadPromptFromFile("resume_prompt.txt");
    const prompt = putValuesToTemplate(template, {
      userDescription: userResumeDescription,
    });

    const modelName = process.env.MODEL_NAME || "gemini-2.5-flash";
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    console.log("🧠 Sending prompt to Gemini model:", modelName);

    // ---- Enforce JSON output ----
    const result = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Return ONLY valid JSON — no markdown, no text before or after. " +
                "Parse errors are forbidden. " +
                "If unsure, output an empty JSON object. " +
                prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const raw = result.text?.trim() || "";
    console.log("✅ Gemini response received.");

    // ---- Parse JSON safely ----
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn("⚠️ JSON.parse failed, cleaning fences...");
      const cleaned = raw.replace(/```json|```|^markdown/gi, "").trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (err2) {
        console.error("❌ Still not valid JSON:", err2.message);
        throw new Error("Model returned invalid JSON");
      }
    }

    const normalized = normalizeResumeData(parsed);
    return { data: normalized };
  } catch (err) {
    console.error("❌ Error generating resume:", err);
    throw new Error("Failed to generate resume");
  }
}
