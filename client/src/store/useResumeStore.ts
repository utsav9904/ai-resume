import { create } from 'zustand';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface ResumeState {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects: any[];
  certifications: any[];
  template: string;
  updatePersonalInfo: (data: Partial<ResumeState['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (category: 'technical' | 'soft' | 'languages', values: string[]) => void;
  setResume: (data: Partial<ResumeState>) => void;
  // Add other update methods later
}

export const useResumeStore = create<ResumeState>((set) => ({
  personalInfo: {
    fullName: '', email: '', phone: '', address: '', linkedin: '', github: '', portfolio: ''
  },
  summary: '',
  education: [],
  experience: [],
  skills: { technical: [], soft: [], languages: [] },
  projects: [],
  certifications: [],
  template: 'modern',

  updatePersonalInfo: (data) => set((state) => ({
    personalInfo: { ...state.personalInfo, ...data }
  })),
  updateSummary: (summary) => set({ summary }),
  
  addExperience: () => set((state) => ({
    experience: [...state.experience, { id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', description: '' }]
  })),
  updateExperience: (id, data) => set((state) => ({
    experience: state.experience.map(exp => exp.id === id ? { ...exp, ...data } : exp)
  })),
  removeExperience: (id) => set((state) => ({
    experience: state.experience.filter(exp => exp.id !== id)
  })),
  
  addEducation: () => set((state) => ({
    education: [...state.education, { id: crypto.randomUUID(), school: '', degree: '', startDate: '', endDate: '', grade: '' }]
  })),
  updateEducation: (id, data) => set((state) => ({
    education: state.education.map(edu => edu.id === id ? { ...edu, ...data } : edu)
  })),
  removeEducation: (id) => set((state) => ({
    education: state.education.filter(edu => edu.id !== id)
  })),

  updateSkills: (category, values) => set((state) => ({
    skills: { ...state.skills, [category]: values }
  })),

  setResume: (data) => set((state) => ({ ...state, ...data })),
}));
