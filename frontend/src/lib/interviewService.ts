import {  InterviewQuestionsResult } from "../types/auth";
import api from "./axios";



export async function getInterviewQuestionsRequest(
    jobDescription:string,
    matchedSkills:string[],
    missingSkills:string[],

):Promise<InterviewQuestionsResult>{
  const { data } = await api.post("/interview/questions", {
    jobDescription,
    matchedSkills,
    missingSkills,
  });
  return {
    questions: data.data?.questions ?? data.questions ?? [],
    focusAreas: data.data?.focusAreas ?? data.data?.focusAreass ?? data.focusAreas ?? [],
  };
}