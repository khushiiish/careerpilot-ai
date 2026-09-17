import { useRef, useState } from "react";
import { useResumeStore } from "../store/resumeStore";


export default function ResumeUpload(){
    const fileInputRef=useRef<HTMLInputElement>(null);
    const [dragOver,setDragOver]=useState(false);
    const [error,setError]=useState<string | null>(null);

    const { isUploading,setUploading,addResume }=useResumeStore();

    return(
        <div className="w-full">
            {error && (
                <div className="mb-4 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                    </div>
            )}
            <div 
            onDragOver={(e) => {e.preventDefault(); setDragOver(true)}}
            onDragLeave={()=> setDragOver(false)}

            className={`
                relative border-2 border-dashed rounded-lg p-10 text-center ciursor-pointer transition-all
                ${dragOver ? "border-signal bg-signal/5"

                :     
                }
                
                `}
            >
                <input onChange={(e)={
                    const file=e.target.files?.[0];
                    if(file) handleFile(file);
                }}
                    ref={fileInputRef} type="file"  accept=".pdf" className="hidden" />
            </div>
        </div>
    )

}