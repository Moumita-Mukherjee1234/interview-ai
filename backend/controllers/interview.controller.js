import { extractTextFromPDF } from "../services/pdf.service.js";
import { generateInterviewReport } from "../services/ai.service.js";

/**
 * POST /api/interview/generate
 * Upload Resume + JD + Self Description → Get Interview Report
 */
export const generateInterview = async (req, res) => {
  try {
    // 1️⃣ Validate inputs
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    const { jobDescription, selfDescription } = req.body;

    if (!jobDescription || !selfDescription) {
      return res
        .status(400)
        .json({ message: "Job description and self description are required" });
    }

    // 2️⃣ Extract PDF text (from multer memory buffer)
    const resumeBuffer = req.file.buffer;
    const resumeText = await extractTextFromPDF(resumeBuffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not read resume content" });
    }

    // 3️⃣ Generate AI interview report
    const report = await generateInterviewReport({
      resumeText,
      jobDescription,
      selfDescription,
    });

    // 4️⃣ Send response
    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Interview Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview report",
    });
  }
};