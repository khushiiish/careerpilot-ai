import { useResumeStore } from "../store/resumeStore";

export default function ResumeCard() {
  const activeResume = useResumeStore((s) => s.activeResume);
  if (!activeResume || !activeResume.parsedSkills) return null;
  const { parsedSkills: data, originalName } = activeResume;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-[#E8BCC9] uppercase tracking-widest mb-1">
            Resume Analyzed
          </p>
          <h2 className="text-xl font-semibold text-white">{originalName}</h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest">
            Experience
          </p>
          <p className="text-2xl font-semibold text-[#E8BCC9]">
            {data.totalYearsExperience}
            <span className="text-sm text-[#8B949E] ml-1">yrs</span>
          </p>
        </div>
      </div>

      <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
        <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest mb-3">
          Skills ({data.skills.length} detected)
        </p>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-[#F8F9FA]/80"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
        <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest mb-4">
          Experience
        </p>
        <div className="space-y-5">
          {data.experience.map((exp, i) => (
            <div
              key={i}
              className={i > 0 ? "pt-5 border-t border-white/10" : ""}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-[#F8F9FA]">{exp.title}</p>
                  <p className="text-xs text-[#8B949E]">{exp.company}</p>
                </div>
                <span className="font-mono text-xs text-[#8B949E] shrink-0 ml-4">
                  {exp.duration}
                </span>
              </div>
              <ul className="space-y-1">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2 text-xs text-[#F8F9FA]/70">
                    <span className="text-[#E8BCC9] mt-0.5 shrink-0">&bull;</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#161B22] border border-white/10 rounded-lg p-5">
        <p className="font-mono text-xs text-[#8B949E] uppercase tracking-widest mb-4">
          Education
        </p>
        <div className="space-y-3">
          {data?.education.map((edu, i) => (
            <div key={i} className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#F8F9FA]">{edu.degree}</p>
                <p className="text-xs text-[#8B949E]">{edu.institution}</p>
              </div>
              <span className="font-mono text-xs text-[#8B949E] shrink-0 ml-4">
                {edu.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
