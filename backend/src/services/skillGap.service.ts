import gemini, { GEMINI_MODEL } from "@/lib/gemini";
import logger from "@/utils/logger";

export interface SkillGapResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  summary: string;
}

const SKILL_GAP_PROMPT = `You are a job application analyst. Compare the candidate's skills against the job description and return a skill gap analysis.

Candidate skills:
{{CANDIDATE_SKILLS}}

Candidate skills are only the skills extracted from the resume.
Do not assume that a candidate has a skill unless it appears in this list.

Job description:
"""
{{JOB_DESCRIPTION}}
"""

Return ONLY valid JSON (no markdown fences, no preamble) with this exact shape:

{
  "matchScore": 72,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "recommendedSkills": ["skill5", "skill6"],
  "summary": "2 sentence summary of fit and biggest gaps"
}

Rules:
- matchScore: 0-100 integer representing how well the candidate fits the job
- matchedSkills: skills that are present in BOTH the candidate's skills and the job description requirements
- missingSkills: skills explicitly required or strongly expected by the job description that are NOT present in the candidate's skills
- recommendedSkills: relevant skills that are NOT explicitly required by the job description but would strengthen the candidate's profile for this specific role
- recommendedSkills must NOT contain any skill already present in matchedSkills or missingSkills
- Do NOT recommend a skill simply because it appears in the candidate's resume
- Recommendations should be based on the job description, role, related technologies, and commonly associated skills
- summary: honest, concise assessment of the candidate's fit
`;

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function analyseSkillGap(
  candidateSkills: string[],
  jobDescription: string
): Promise<SkillGapResult> {
  const prompt = SKILL_GAP_PROMPT
    .replace(
      "{{CANDIDATE_SKILLS}}",
      candidateSkills.join(", ")
    )
    .replace(
      "{{JOB_DESCRIPTION}}",
      jobDescription
    );

  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini did not return a text response");
  }

  const cleaned = stripMarkdownFences(text);

  try {
    return JSON.parse(cleaned) as SkillGapResult;
  } catch (err) {
    logger.error("Failed to parse skill gap JSON", {
      error: (err as Error).message,
      raw: text,
    });

    throw new Error(
      "Failed to parse skill gap data from Gemini response"
    );
  }
}