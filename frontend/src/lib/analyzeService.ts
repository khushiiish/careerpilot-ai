import api from "./axios"
import { SkillGapResult } from "../types/auth";

export async function analyzeJobFitRequest(
  resumeId: string,
  jobDescription: string
): Promise<SkillGapResult> {
  const { data } = await api.post("/analyze/job-fit", {
    resumeId,
    jobDescription,
  });

  return data.analysis;
}