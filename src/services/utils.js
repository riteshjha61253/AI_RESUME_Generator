import fs from "fs-extra";
import path from "path";

/** Load a prompt template from /prompts folder */
export async function loadPromptFromFile(filename) {
  const filePath = path.resolve("prompts", filename);
  return fs.readFile(filePath, "utf-8");
}

/** Replace {{placeholders}} in the template */
export function putValuesToTemplate(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

/** Parse Gemini response (thinking + JSON if available) */
export function parseMultipleResponses(responseText) {
  const jsonResponse = {};

  const thinkMatch = responseText.match(/<think>([\s\S]*?)<\/think>/);
  jsonResponse.think = thinkMatch ? thinkMatch[1].trim() : null;

  const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      jsonResponse.data = JSON.parse(jsonMatch[1].trim());
    } catch (e) {
      console.error("Invalid JSON format in Gemini response:", e.message);
      jsonResponse.data = null;
    }
  } else {
    // Fallback: return raw markdown if not JSON
    jsonResponse.data = responseText.replace(/```(?:markdown)?/g, "").trim();
  }

  return jsonResponse;
}

