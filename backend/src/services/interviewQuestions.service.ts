import gemini, { GEMINI_MODEL } from "@/lib/gemini";
import logger from "@/utils/logger";

export interface InterviewQuestions {
  category: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  tip: string;
}

export interface InterviewQuestionResult {
  questions: InterviewQuestions[];
  focusAreas: string[];
}

const INTERVIEW_PROMPT = `You are an expert technical interviewer. Generate interview questions for a candidate based on the job description and their skill gaps.

Job description summary:
{{JOB_DESCRIPTION}}

Candidate's missing skills:
{{MISSING_SKILLS}}

Candidate's matched skills:
{{MATCHED_SKILLS}}

Return ONLY valid JSON (no markdown fences, no preamble) with this exact shape:

{
  "questions": [
    {
      "category": "Technical",
      "question": "...",
      "difficulty": "medium",
      "tip": "What to focus on when answering this"
    }
  ],
  "focusAreas": ["area1", "area2"]
}

Rules:
- Generate exactly 8 questions total
- Mix of categories: Technical, Behavioral, System Design, Problem Solving
- Mix of difficulties: 2 easy, 4 medium, 2 hard
- Focus questions on both matched skills (to confirm depth) and missing skills (to probe gaps)
- tip should be 1 sentence of actionable advice for answering
- focusAreas: 3-4 key topics the candidate should study before this interview`;

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function generateInterviewQuestions(
  jobDescription: string,
  matchedSkills: string[],
  missingSkills: string[]
): Promise<InterviewQuestionResult> {
  const prompt = INTERVIEW_PROMPT.replace(
    "{{JOB_DESCRIPTION}}",
    jobDescription.slice(0, 500)
  )
    .replace("{{MISSING_SKILLS}}", missingSkills.join(", "))
    .replace("{{MATCHED_SKILLS}}", matchedSkills.join(", "));

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
    return JSON.parse(cleaned) as InterviewQuestionResult;
  } catch (err) {
    logger.error("Failed to parse interview questions JSON", {
      raw: text,
    });

    throw new Error(
      "Failed to parse interview questions from Gemini response"
    );
  }
}