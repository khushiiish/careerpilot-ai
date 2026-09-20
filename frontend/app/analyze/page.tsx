"use client";

import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { analyzeJobFitRequest } from "@/src/lib/analyzeService";
import { getInterviewQuestionsRequest } from "@/src/lib/interviewService";
import { getMyResumesRequest } from "@/src/lib/resumeService";
import { useResumeStore } from "@/src/store/resumeStore";
import { InterviewQuestionsResult, SkillGapResult } from "@/src/types/auth";
import { isAxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function AnalyzePage() {
  const { isAuthenticated } = useRequireAuth();
  const { resumes } = useResumeStore();

  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [interviewData,setInterviewData]=useState<InterviewQuestionsResult | null>(null);
  const[interviewLoading,setInterviewLoading]=useState(false);
  const [atsLoading,setAtsLoading]=useState(false);

  useEffect(()=> {
    if(!isAuthenticated)return;
    if(resumes.length === 0){
      getMyResumesRequest().then((data)=>{
        setResumes(data.resumes);
        if(data.resumes.length >0) setSelectedResumeId(data.resumes[0].id);
      }).catch(()=>{});
    }else{
      setSelectedResumeId(resumes[0].id)
    }
  },[isAuthenticated]);

  async function handleAnalyze(){
    if(!selectedResumeId || jobDescription.trim().length <50){
      setError("Please select a resume and paste a job description (min 50 characters)");
      return;
    }
    setError(null);
    setResult(null);
    setInterviewData(null);
    setLoading(true);

    try{
      const analysis=await analyzeJobFitRequest(selectedResumeId, jobDescription);
      setResult(analysis);

    }catch(err){
      if(isAxiosError(err)){
        setError(err.response?.data?.message ?? "Analysis failed");


      }else{
        setError("Something went wrong")

      }
    }
  }

  async function handleGenerateQuestions(){
    if(!result)return;
    setInterviewLoading(true);
    try{
      const data=await getInterviewQuestionsRequest(
        jobDescription,
        result.matchedSkills,
        result.missingSkills
      );
      setInterviewData(data);

    }catch{
      setError("Failed to generate interview questions")

    }finally{
      setInterviewLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link
          href="/dashboard"
          className="font-display font-semibold text-lg tracking-tight"
        >
          JobPrep<span className="text-signal">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="font-mono text-xs text-muted uppercase tracking-wide hover:text-paper transition"
          >
            Dashboard
          </Link>

          <span className="font-mono text-xs text-signal uppercase tracking-wide">
            Analyze
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs text-signal uppercase tracking-widest mb-2">
            Job Fit Analysis
          </p>

          <h1 className="font-display text-3xl font-semibold mb-1">
            Analyze your fit
          </h1>

          <p className="text-muted text-sm">
            Paste a job description and we'll compare it against your resume
            skills
          </p>
        </div>

        {resumes?.length === 0 ? (
          <div className="border border-white/10 rounded-lg p-10 text-center">
            <p className="text-muted text-sm mb-4">
              You need to upload a resume first
            </p>

            <Link
              href="/dashboard"
              className="text-sm text-signal hover:text-signal/80 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {resumes.length > 1 && (
              <div>
                <label className="font-mono text-xs text-muted uppercase tracking-wide block mb-2">
                  Select Resume
                </label>

                <select
                  className="w-full bg-surface border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/50 transition"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.originalName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-mono text-xs text-muted uppercase tracking-wide block mb-2">
                Job Description
              </label>

              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full bg-surface border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/50 transition resize-none"
              />

              <p className="font-mono text-xs text-muted mt-1">
                {jobDescription.length} Characters
              </p>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
            onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-signal text-ink font-medium text-sm rounded-md py-2.5 hover:bg-signal/90 disabled:opacity-50 transition"
            >
              {loading ? "Analyzing with AI..." : "Analyze Job Fit"}
            </button>

            {result && (
              <div className="space-y-5 pt-4">
                <div className="bg-surface border border-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest">
                      Match Score
                    </p>

                    <span
                      className={`font-display text-4xl font-semibold ${
                        result.matchScore >= 70
                          ? "text-verified"
                          : result.matchScore >= 50
                            ? "text-signal"
                            : "text-red-400"
                      }`}
                    >
                      {result.matchScore}%
                    </span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      style={{
                        width: `${result.matchScore}%`,
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        result.matchScore >= 70
                          ? "bg-verified"
                          : result.matchScore >= 50
                            ? "bg-signal"
                            : "bg-red-400"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-muted mt-4 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <div className="bg-surface border border-white/5 rounded-lg p-5">
                  <p className="font-mono text-xs text-verified uppercase tracking-widest mb-3">
                    Matched Skills {result.matchedSkills.length}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-verified/10 border border-verified/20 text-xs font-mono text-verified"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                     <div className="bg-surface border border-white/5 rounded-lg p-5">
                  <p className="font-mono text-xs text-red-400 uppercase tracking-widest mb-3">
                    Missing Skills . {result.missingSkills.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-verified/10 border border-verified/20 text-xs font-mono text-verified"
                      >
                        {s}
                      </span>
                    ))}

                    </div>


                </div>
                  <div className="bg-surface border border-white/5 rounded-lg p-5">
                  <p className="font-mono text-xs text-verified uppercase tracking-widest mb-3">
                    Recommeneded to Add . {result.matchedSkills.length}
                  </p>
                  <div>
                    {result.recommendedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-verified/10 border border-verified/20 text-xs font-mono text-verified"
                      >
                        {s}
                      </span>
                    ))}

                    </div>


                </div>
                <button disabled={atsLoading} className="w-full bg-signal text-ink font-medium text-sm rounded-md py-2.5 hover:bg-signal/90 disabled:opacity-50 transition flex items-center justify-center gap-2">
                  {atsLoading ? (
                    <>
                    <div className="w-5 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    Rewriting and generating PDF...
                    
                    </>
                    
                  ):(
                    <>
                    <span>↓</span>
                    Download ATS-Optimized Resume
                    
                    </>

                  )}
                </button>
                {!interviewData && (
                  <button 
                  onClick={handleGenerateQuestions}
                  disabled={interviewLoading}
                  
                  className="w-full bg-surface border border-white/10 text-paper font-medium text-sm rounded-md py-2.5 hover:border-signal/50 hover:text-signal disabled:opacity-50 transition flex items-center justify-center gap-2 ">
                    {interviewLoading ?(
                      <>
                      <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin"/>
                      Generating Questions...
                      </>
                      ):(
                        "Generate Interview Questions"

                      )}
                  </button>
                )}

                {interviewData && (
                  <div className="space-y-5 pt-2">
                    <div className="bg-surface border border-white/5 rounded-lg p-5">
                      <p className="font-mono text-xs text-signal uppercase tracking-widest mb-3">Study before this interview</p>

                      </div>
                      {interviewData.focusAreass.map((area)=>(
                        <span key={area} className="px-2.5 py-1 rounded-md bg-signal/10 border border-signal/20 text-xs font-mono text-signal">{area}</span>
                      ))}

                    </div>
                    </div>

                    {interviewData.questions.map((q,i)=>{
                      <div key={i} className="bg-surface border border-white/5 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs text-muted uppercase tracking-widest">{q.category}</span>
                          <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${q.difficulty=="hard"
                          ? "text-red-400 border-red-400/30 bg-red-400/10"
                          : q.difficulty === "medium"
                          ? "text-signal border-signal/30 bg-signal/10"
                          : "text-verified border-verified/30 bg-verified/10"
                          }
                          `}>
                            {q.difficulty}


                          </span>

                          </div>
                          <p className="text-sm text-paper leading-relaxed mb-3">{q.question}</p>

                          <div className="flex gap-2 pt-3 border-t border-white/5">
                          <span className="text-signal text-xs mt-0.5 shrink-0">💡</span>
                            <p className="text-xs text-muted leading-relaxed">{q.tip}</p>


                            </div>

                        </div>


                ))}

                )}
              </div>
            }
          </div>
        )}
      </main>
    </div>
  );
}
