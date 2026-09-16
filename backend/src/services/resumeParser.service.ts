import gemini, { GEMINI_MODEL } from "@/lib/gemini";
import logger from "@/utils/logger";

export interface ParsedResumeData {
  summary: string;

  skills: string[];

  experience: {
    title: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];

  education: {
    degree: string;
    institution: string;
    year: string;
  }[];

  totalYearsExperience: number;
}

const EXTRACTION_PROMPT = `You are a resume parsing engine.

Extract structured information from the resume text below.

Return ONLY valid JSON.
Do not return markdown.
Do not use code fences.
Do not add any explanation before or after the JSON.

The JSON must exactly match this structure:

{
  "summary": "2–3 sentence professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "highlights": ["", ""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "totalYearsExperience": 0
}

Rules:
- Extract only information that is present in the resume.
- Do not invent skills, companies, job titles, education, or experience.
- If a field is not available, use an empty string or empty array.
- totalYearsExperience should be a number.
- Keep the summary professional and concise.

Resume text:
"""
{{RESUME_TEXT}}
"""
`;

function stripMarkdownFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function parseResumeWithGemini(
  resumeText: string
): Promise<ParsedResumeData> {
  const prompt = EXTRACTION_PROMPT.replace(
    "{{RESUME_TEXT}}",
    resumeText
  );

  try {
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
      return JSON.parse(cleaned) as ParsedResumeData;
    } catch (err) {
      logger.error("Failed to parse Gemini resume JSON", {
        error: (err as Error).message,
        raw: text,
      });

      throw new Error(
        "Failed to parse resume data from AI response"
      );
    }
  } catch (err) {
    logger.error("Gemini resume parsing failed", {
      error: (err as Error).message,
    });

    throw err;
  }
}