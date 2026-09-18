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

export default function DashboardPage() {
  const { user, isAuthenticated } = useRequireAuth();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { resumes, activeResume, setResumes, setActiveResume } =
    useResumeStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
  }, [isAuthenticated]);

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
    <div className="min-h-screen bg-ink">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <span className="font-display font-semibold text-lg tracking-tight">
          JobPrep<span className="text-signal">.</span>
        </span>
        <div className="flex items-center gap-6">
          <span>{user?.name}</span>
          <Link
            href={"/analyze"}
            className="font-mono text-xs text-muted uppercase tracking-wide hover:text-paper transition"
          >
            Analyze
          </Link>
          <button className="font-mono text-xs text-muted uppercase tracking-wide hover:text-paper transition">
            Log out
          </button>
        </div>
      </nav>
      <main className="max-w-3 mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs text-signal uppercase tracking-widest mb-2">
            Welcome back
          </p>
          <h1 className="font-display text-3xl font-semibold">{user.name}</h1>
        </div>

        {resumes.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {resumes?.map((r) => (
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition ${activeResume?.id == r.id} ? "bg-signal
                            text-ink" :"bg-surface text-muted border border-white/10 hover:text-paper`}
                key={r.id}
                onClick={() => setActiveResume(r)}
              >
                {r.originalName}
              </button>
            ))}
          </div>
        )}
        <div className='mb-8'>
          <ResumeUpload/>
        </div>

        {activeResume ? (
          <ResumeCard />
          ):(
            <div className="border border-white/10 rounded-lg p-10 text-center">
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">No Resume yet</p>
              <p className="text-sm text-muted">Upload your resume above to get started with AI Analysis </p>


            </div>

          )}
      </main>
    </div>
  );
}
