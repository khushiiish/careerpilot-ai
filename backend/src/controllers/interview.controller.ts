import { Response } from "express";
import z from "zod";
import { generateInterviewQuestions } from "@/services/interviewQuestions.service";
import { AuthRequest } from "@/middlewares/auth.middleware";
import logger from "@/utils/logger";

const interviewSchema = z.object({
  jobDescription: z.string().min(50, "Job description too short"),
  matchedSkills: z.array(z.string()).min(1),
  missingSkills: z.array(z.string()),
});

export async function getInterviewQuestions(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const parsed = interviewSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const {
      jobDescription,
      matchedSkills,
      missingSkills,
    } = parsed.data;

    const result = await generateInterviewQuestions(
      jobDescription,
      matchedSkills,
      missingSkills
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    logger.error("Interview questions generation failed", {
      error: (err as Error).message,
    });

    res.status(500).json({
      status: "error",
      message: "Failed to generate interview questions",
    });
  }
}