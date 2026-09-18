import gemini, { GEMINI_MODEL } from "@/lib/gemini";
import logger from "@/utils/logger";

export interface SkillGapResult {
    matchScore:number; 
    matchedSkill:string[]; 
    missingSkills:string[]; 
    recommendedSkills:string[]; 
    summary:string; 
} 

const SKILL_GAP_PROMPT=`You are a job application analyst. Compare the candidate's skills against the job description and return a skill gap analysis. 
 
Candidate skills: 
{{CANDIDATE_SKILLS}} 
 
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
- matchScore: 0-100 integer representing how well the candidate fits 
- matchedSkills: skills the candidate HAS that the job requires 
- missingSkills: skills the job requires that the candidate is MISSING 
- recommendedSkills: additional skills that would strengthen the application (not strictly required but mentioned or implied) 
- summary: honest, concise assessment 
`; 
 
function stripMarkdownFences(text:string):string { 
    return text 
    .trim() 
    .replace(/^```(?:json)?\s*/i, "") 
    .replace(/```\s*$/i, "") 
    .trim(); 
 
} 
 
export async function analyseSkillGap( 
    candidateSkills:string[], 
    jobDescription:string, 
):Promise<SkillGapResult>{ 
    const prompt =SKILL_GAP_PROMPT.replace( 
        "{{CANDIDATE_SKILLS}}", 
        candidateSkills.join(", "), 
    ).replace("{{JOB_DESCRIPTION}}",jobDescription) 
 
    const response=await gemini.models.generateContent({ 
        model:GEMINI_MODEL, 
        contents:prompt
    }) 
    
    const text=response.text;

    if(!text){ 
        throw new Error("Gemini did not return a text response"); 
    } 
 
    const cleaned=stripMarkdownFences(text);

    try{
        return JSON.parse(cleaned) as SkillGapResult;
    }catch(err){
        logger.error("Failed to parse skill gap JSON",{raw: text})
        throw new Error("Failed to parse skill gap data from Gemini response");
    }


}