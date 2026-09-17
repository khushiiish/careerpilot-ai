import { create } from "zustand";

interface ParsedData {
  summary: string;
  skills: string[];

  experience: {
    title: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];

  education: {
    degree: string;
    institution: string;
    year: string;
  }[];

  totalYearsExperience: number;
}

interface Resume {
  id: string;
  originalName: string;
  parsedSkills: ParsedData | null;
  atsScore: number | null;
  createdAt: string;
}

interface ResumeState {
  resumes: Resume[];
  activeResume: Resume | null;
  isUploading: boolean;

  setResumes: (resumes: Resume[]) => void;
  setActiveResume: (resume: Resume | null) => void;
  addResume: (resume: Resume) => void;
  setUploading: (val: boolean) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  activeResume: null,
  isUploading: false,

  setResumes: (resumes) =>
    set({
      resumes,
      activeResume: resumes[0] ?? null,
    }),

  setActiveResume: (resume) =>
    set({
      activeResume: resume,
    }),

  addResume: (resume) =>
    set((state) => ({
      resumes: [resume, ...state.resumes],
      activeResume: resume,
    })),

  setUploading: (val) =>
    set({
      isUploading: val,
    }),
}));