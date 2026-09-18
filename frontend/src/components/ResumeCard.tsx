import { useResumeStore } from "../store/resumeStore";



export default function ResumeCard(){
    const activeResume=useResumeStore((s)=> s.activeResume);
    if(!activeResume || !activeResume.parsedSkills) return null;
    const {parsedSkills:data ,originalName}=activeResume;

    return(
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-mono text-xs text-signal upperacse tracking-widest mb-1">Resume Analyzed</p>
                    <h2 className="font-display text-xl font-semibold">{originalName}</h2>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest">Experience</p>
                    <p className="font-display text-2xl font-semibold text-signal">{data.totalYearsExperience}
                        <span className="text-sm text-muted font-body ml-1">
                            yrs
                        </span>


                    </p>
                </div>
            </div>

        </div>
    )
}