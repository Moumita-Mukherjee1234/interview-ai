import { GoogleGenAI } from "@google/genai";
import { interviewSchema } from "../schemas/interview.schema.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateInterviewReport = async ({
  resumeText,
  jobDescription,
  selfDescription,
}) => {
  try {
    const prompt = `
You are an AI Interview Coach.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

Format:
{
  "technicalQuestions": ["string"],
  "behavioralQuestions": ["string"],
  "skillGaps": ["string"],
  "preparationPlan": ["string"],
  "matchScore": number
}

Resume:
${resumeText}

Job Description:
${jobDescription}

Candidate Description:
${selfDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // ✅ Correct way to read Gemini output
    const text = response.candidates[0].content.parts[0].text
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    // ✅ Zod validation
    const validated = interviewSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("AI response validation failed");
  }
};