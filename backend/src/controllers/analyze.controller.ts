import { AuthRequest } from "@/middlewares/auth.middleware";
import logger from "@/utils/logger";
import z from "zod";
import { Response } from "express";
import { analyseSkillGap } from "@/services/skillGap.service";
import prisma from "@/lib/prisma";

const analyzeSchema = z.object({
  resumeId: z.string().uuid("Invalid resume ID"),
  jobDescription: z.string().min(50, "Job description is too short"),
});

export async function analyzeJobFit(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const parsed = analyzeSchema.safeParse(req.body);

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

    const { resumeId, jobDescription } = parsed.data;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
    });

    if (!resume) {
      res.status(404).json({
        status: "error",
        message: "Resume not found",
      });
      return;
    }

    const parsedSkills = resume.parsedSkills as {
      skills?: string[];
    } | null;

    const skills = parsedSkills?.skills ?? [];

    if (skills.length === 0) {
      res.status(400).json({
        status: "error",
        message: "Resume has no parsed skills",
      });
      return;
    }

    logger.info("Running skill gap analysis", {
      userId,
      resumeId,
    });

    const result = await analyseSkillGap(
      skills,
      jobDescription
    );

    res.status(200).json({
      status: "success",
      analysis: result,
    });
  } catch (err) {
    logger.error("Skill gap analysis failed", {
      error: (err as Error).message,
    });

    res.status(500).json({
      status: "error",
      message: "Analysis failed",
    });
  }
}