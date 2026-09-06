import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#0E1116] text-[#F8F9FA]">
      {/* Left Column (Banner) */}
      <div className="relative hidden md:flex flex-col justify-between bg-[#161B22] border-r border-white/10 p-12 overflow-hidden">
        {/* Logo */}
        <div className="relative z-10">
          <span className="font-display font-semibold text-xl tracking-tight text-white">
            JobPrep<span className="text-[#E8BCC9]">.</span>
          </span>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-md">
          <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-[0.2em] mb-3">
            Resume analysis &bull; in progress
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight mb-4 text-white">
            Every gap in your resume,
            <br />
            <span className="text-[#E8BCC9]">found before</span> the recruiter finds it.
          </h1>
          <p className="text-[#8B949E] text-sm leading-relaxed">
            ATS-optimized rewrites and tailored interview questions in seconds.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-[#8B949E] font-mono">
          ATS-Optimised skill gap detection &bull; AI Interview Prep
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex items-center justify-center p-8 bg-[#0E1116]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
