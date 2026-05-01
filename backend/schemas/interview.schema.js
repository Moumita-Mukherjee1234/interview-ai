import { z } from "zod";

export const interviewSchema = z.object({
  technicalQuestions: z.array(z.string()),
  behavioralQuestions: z.array(z.string()),
  skillGaps: z.array(z.string()),
  preparationPlan: z.array(z.string()),
  matchScore: z.number().min(0).max(100),
});