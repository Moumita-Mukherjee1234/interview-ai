import express from "express";

import InterviewReport from "../models/InterviewReport.model.js";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

import { extractTextFromPDF } from "../services/pdf.service.js";
import { generateInterviewReport } from "../services/ai.service.js";

const router = express.Router();

// POST /api/interview
router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobDescription, selfDescription } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // ✅ Use buffer directly (NO fs, NO path)
      const resumeText = await extractTextFromPDF(req.file.buffer);

      // ✅ Generate AI report
      const aiReport = await generateInterviewReport({
        resumeText,
        jobDescription,
        selfDescription,
      });

      // ✅ Save to DB
      const savedReport = await InterviewReport.create({
        userId: req.user._id,
        ...aiReport,
      });

      res.status(201).json({
        message: "Interview report generated & saved",
        report: savedReport,
      });

    } catch (error) {
      console.error("INTERVIEW ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;