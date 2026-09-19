"use client";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { logoutRequest } from "@/src/lib/authService";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/src/store/resumeStore";
import Link from "next/link";
import ResumeUpload from "@/src/components/ResumeUpload";
import React, { useEffect } from "react";
import ResumeCard from "@/src/components/ResumeCard";
import { getMyResumesRequest } from "@/src/lib/resumeService";

export default function DashboardPage() {
  const { user, isAuthenticated } = useRequireAuth();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { resumes, activeResume, setResumes, setActiveResume } =
    useResumeStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
  
  getMyResumesRequest()
  .then((data)=> setResumes(data.resumes))
  .catch(()=>{});
},[isAuthenticated]);

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch {
    } finally {
      clearAuth();
      router.push("/login");
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Checking session....
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0E1116] text-[#F8F9FA] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
          JobPrep<span className="text-[#E8BCC9]">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-[#A7AFBA]">{user?.name}</span>
          <Link
            href={"/analyze"}
            className="font-mono text-xs text-[#A7AFBA] uppercase tracking-wide hover:text-white transition-colors duration-200"
          >
            Analyze
          </Link>
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-[#A7AFBA] uppercase tracking-wide hover:text-white transition-colors duration-200"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto px-6 md:px-8 py-10 flex-1">
        <div className="mb-8">
          <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-[0.2em] mb-2">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">{user.name}</h1>
        </div>

        {resumes.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {resumes.map((r) => (
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition ${
                  activeResume?.id === r.id
                    ? "bg-[#E8BCC9] text-[#0E1116] font-medium"
                    : "bg-[#161B22] text-[#8B949E] border border-white/10 hover:text-white"
                }`}
                key={r.id}
                onClick={() => setActiveResume(r)}
              >
                {r.originalName}
              </button>
            ))}
          </div>
        )}

        <div className="mb-8">
          <ResumeUpload />
        </div>

        {activeResume ? (
          <ResumeCard />
        ) : (
          <div className="bg-[#161B22] border border-white/10 rounded-lg p-10 text-center">
            <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest mb-2">
              No Resume yet
            </p>
            <p className="text-sm text-[#8B949E]">
              Upload your resume above to get started with AI Analysis
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
