


 export interface InterviewQuestions{
    category:string;
    question:string;
    difficulty:"easy" | "medium" | "hard";
    tip:string;
 }

 export interface InterviewQuestionResult {
    questions:InterviewQuestions[];
    focusArea:string[],

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


