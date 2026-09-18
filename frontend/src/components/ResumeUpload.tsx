"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "../store/resumeStore";

export default function ResumeUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isUploading, setUploading, addResume } = useResumeStore();

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        
        className={`
          relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all
          ${
            dragOver
              ? "border-signal bg-signal/5"
              : "border-white/10 hover:border-white/20 hover:bg-white/5"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          onChange={(e) => {
            const file = e.target.files?.[0];

          
          }}
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
        />
        {isUploading ? (

          <div className="space-y-3">
            <div className="w-8 h-8 border-2 border-signal border-t  border-t-transparent rounded-full animate-spin mx-auto"/>

            <p className="font-mono text-xs text-muted uppercase tracking-widest">Analyzing with AI...</p>
            </div>
        ):(
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3  3m3-3l3 3M6 20h12a2 2 0 002-2V8a2 2 0 00-.586-1.414l-4-4A2 2 0 0012.172 2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />

            </svg>


              </div>
              <div >
                <p className="text-sm text-paper">Drop your resume here or {" "}
                <span className="text-signal">Browse</span>
                </p>
                <p className="font-mono text-xs text-muted mt-1">PDF only max 5MB</p>
                </div>



            </div>


        )}
      </div>
    </div>
  );
}