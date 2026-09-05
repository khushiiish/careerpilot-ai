import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0E1116] text-[#F8F9FA] flex flex-col">

      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">

        <div className="text-2xl font-semibold tracking-tight text-white">
          JobPrep<span className="text-[#E8BCC9]">.</span>
        </div>

        <div className="flex items-center gap-5">

          <Link
            className="font-mono text-xs text-[#A7AFBA] uppercase tracking-wide hover:text-white transition-colors duration-200"
            href={"/login"}
          >
            Log In
          </Link>

          <Link
            href={"/signup"}
            className="font-mono text-xs bg-[#E8BCC9] text-[#0E1116] px-5 py-2.5 rounded-md uppercase tracking-wide font-semibold hover:bg-[#f2cbd6] transition-all duration-200"
          >
            Get Started
          </Link>

        </div>

      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">

        <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-[0.25em] mb-5">
          AI powered Job Preparation
        </p>

        <h1 className="text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight max-w-2xl mb-2 text-white">
          Every gap in your resume,{" "}
        

        <span className="text-[#E8BCC9] text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight">
          found before
        </span>{" "}
        the recruiter finds it.</h1>

      
      <p className="text-muted text-lg max-w-xl leading-relaxed mb-10">Upload your resume. Paste a job description. Get AI-powered skill gap analysis, ATS-optimized rewrites, and tailored interview questions -in seconds.</p>

      <div className="flex items-center gap-4">
        <Link href={"/signup"} className="bg-signal text-ink font-medium text-sm rounded-md px-8 py-3 hover:bg-signal/90 transition">
        Start for free
        </Link>
        <Link href={"/login"} className="bg-surface border border-white/10 text-paper font-medium text-sm  rounded-md px-8 py-3 hover:border-white/20 transition">
        Log in
        </Link>

        </div>
        </main>
        <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-8">
          {[
            "Resume Parsing",
            "Skill Gap Detection",
            "ATS Resume Rewrite",
            "Interview Questions",
            "PDF Download",
          ].map((f)=> (
            <span 
            key={f}
            className="px-3 py-1.5 rounded-full bg-surface border border-white/10 font-mono text-xs text-muted">
              {f}

            </span>
          ))}

        </div>


    </div>
    
  );
}