import React from "react";

interface AuthLayoutProps {
    children:React.ReactNode
}
export default function AuthLayout({children}:AuthLayoutProps) {
    return(
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="relative hidden lg:flex flex-col justify-between bg-surface border-r border-white/5 p-12 overflow-hidden">
                {/* <ScanLine /> */}
                <div className="relative z-10">
                    <span className="font-display font-semibold text-lg tracking-tight">Job Prep<span className="text-signal"></span></span>
                </div>
                <div className="relative z-10 max-w-md">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Resume analysis  in progress</p>
                    <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
                        Every gap in your resume,
                        <br />
                        found before the recruiter finds it.
                    </h1>
                    <p className="text-muted text-sm leading-relaxed"></p>
                </div>
            </div>
            <div className="relative z-10 text-xs text-muted font-mono">ATS-Optimised skill gap detection AI Interview Prep</div>

            <div className="flex items-center justify-center p-8 bg-ink">
                <div className="w-full max-w-sm">{children}</div>
            </div>

        </div>
    )
}