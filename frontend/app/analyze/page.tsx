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
  const { resumes, setResumes } = useResumeStore();

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
      <div className="min-h-screen bg-[#0E1116] flex items-center justify-center">
        <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#F8F9FA] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-white"
        >
          JobPrep<span className="text-[#E8BCC9]">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="font-mono text-xs text-[#A7AFBA] uppercase tracking-wide hover:text-white transition-colors duration-200"
          >
            Dashboard
          </Link>

          <span className="font-mono text-xs text-[#E8BCC9] uppercase tracking-wide font-medium">
            Analyze
          </span>
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto px-6 md:px-8 py-10 flex-1">
        <div className="mb-8">
          <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-[0.2em] mb-2">
            Job Fit Analysis
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Analyze your fit
          </h1>

          <p className="text-[#A7AFBA] text-sm">
            Paste a job description and we&apos;ll compare it against your resume skills
          </p>
        </div>

        {resumes?.length === 0 ? (
          <div className="bg-[#161B22] border border-white/10 rounded-lg p-10 text-center">
            <p className="text-[#8B949E] text-sm mb-4">
              You need to upload a resume first to start analysis
            </p>

            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 rounded-md bg-[#E8BCC9] text-[#0E1116] font-semibold text-xs font-mono uppercase tracking-wide hover:bg-[#f2cbd6] transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {resumes.length > 1 && (
              <div>
                <label className="font-mono text-xs text-[#8B949E] uppercase tracking-wide block mb-2">
                  Select Resume
                </label>

                <select
                  className="w-full bg-[#161B22] border border-white/10 rounded-md px-3.5 py-2.5 text-sm text-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#E8BCC9]/40 focus:border-[#E8BCC9] transition cursor-pointer"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#161B22] text-[#F8F9FA]">
                      {r.originalName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-mono text-xs text-[#8B949E] uppercase tracking-wide block mb-2">
                Job Description
              </label>

              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full bg-[#161B22] border border-white/10 rounded-md px-4 py-3 text-sm text-[#F8F9FA] placeholder:text-[#8B949E]/50 focus:outline-none focus:ring-2 focus:ring-[#E8BCC9]/40 focus:border-[#E8BCC9] transition resize-none leading-relaxed"
              />

              <p className="font-mono text-xs text-[#8B949E] mt-1.5">
                {jobDescription.length} characters (min. 50 recommended)
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-[#E8BCC9] text-[#0E1116] font-semibold text-sm rounded-md py-3 hover:bg-[#f2cbd6] disabled:opacity-50 transition-all duration-200 cursor-pointer"
            >
              {loading ? "Analyzing with AI..." : "Analyze Job Fit"}
            </button>

            {result && (
              <div className="space-y-6 pt-2">
                {/* MATCH SCORE & SUMMARY CARD */}
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest">
                      Match Score
                    </p>

                    <span
                      className={`text-4xl font-semibold tracking-tight ${
                        result.matchScore >= 70
                          ? "text-[#4F8A75]"
                          : result.matchScore >= 50
                            ? "text-[#E8BCC9]"
                            : "text-red-400"
                      }`}
                    >
                      {result.matchScore}%
                    </span>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      style={{
                        width: `${result.matchScore}%`,
                      }}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        result.matchScore >= 70
                          ? "bg-[#4F8A75]"
                          : result.matchScore >= 50
                            ? "bg-[#E8BCC9]"
                            : "bg-red-400"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-[#F8F9FA]/90 mt-5 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {/* MATCHED SKILLS */}
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
                  <p className="font-mono text-xs text-[#4F8A75] uppercase tracking-widest mb-3">
                    Matched Skills · {result.matchedSkills.length}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-[#4F8A75]/10 border border-[#4F8A75]/30 text-xs font-mono text-[#4F8A75]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MISSING SKILLS */}
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
                  <p className="font-mono text-xs text-red-400 uppercase tracking-widest mb-3">
                    Missing Skills · {result.missingSkills.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RECOMMENDED SKILLS */}
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
                  <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-widest mb-3">
                    Recommended to Add · {result.recommendedSkills.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-[#E8BCC9]/10 border border-[#E8BCC9]/30 text-xs font-mono text-[#E8BCC9]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ATS RESUME BUTTON */}
                <button
                  disabled={atsLoading}
                  className="w-full bg-[#E8BCC9] text-[#0E1116] font-semibold text-sm rounded-md py-3 hover:bg-[#f2cbd6] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {atsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0E1116] border-t-transparent rounded-full animate-spin" />
                      Rewriting and generating PDF...
                    </>
                  ) : (
                    <>
                      <span>↓</span>
                      Download ATS-Optimized Resume
                    </>
                  )}
                </button>

                {/* INTERVIEW QUESTIONS CTA */}
                {!interviewData && (
                  <button
                    onClick={handleGenerateQuestions}
                    disabled={interviewLoading}
                    className="w-full bg-[#161B22] border border-white/10 text-[#F8F9FA] hover:border-[#E8BCC9]/50 hover:text-[#E8BCC9] font-medium text-sm rounded-md py-3 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {interviewLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#8B949E] border-t-transparent rounded-full animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      "Generate Interview Questions"
                    )}
                  </button>
                )}

                {/* INTERVIEW QUESTIONS RESULTS */}
                {interviewData && (
                  <div className="space-y-5 pt-2">
                    {/* FOCUS AREAS */}
                    <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
                      <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-widest mb-3">
                        Study before this interview
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {interviewData.focusAreas?.map((area) => (
                          <span
                            key={area}
                            className="px-2.5 py-1 rounded-md bg-[#E8BCC9]/10 border border-[#E8BCC9]/30 text-xs font-mono text-[#E8BCC9]"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* QUESTIONS LIST */}
                    {interviewData.questions?.map((q, i) => (
                      <div
                        key={i}
                        className="bg-[#161B22] border border-white/10 rounded-lg p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs text-[#8B949E] uppercase tracking-widest">
                            {q.category}
                          </span>
                          <span
                            className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                              q.difficulty === "hard"
                                ? "text-red-400 border-red-400/30 bg-red-400/10"
                                : q.difficulty === "medium"
                                ? "text-[#E8BCC9] border-[#E8BCC9]/30 bg-[#E8BCC9]/10"
                                : "text-[#4F8A75] border-[#4F8A75]/30 bg-[#4F8A75]/10"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-[#F8F9FA] leading-relaxed mb-3">
                          {q.question}
                        </p>
                        <div className="flex gap-2.5 pt-3 border-t border-white/10">
                          <span className="text-[#E8BCC9] text-xs mt-0.5 shrink-0">
                            💡
                          </span>
                          <p className="text-xs text-[#A7AFBA] leading-relaxed">
                            {q.tip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
