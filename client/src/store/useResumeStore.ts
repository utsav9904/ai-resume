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

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  githubLink: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
}

export interface CustomizationSettings {
  fontFamily: 'inter' | 'roboto' | 'outfit' | 'merriweather' | 'playfair' | 'fira-code';
  fontSize: 'xs' | 'sm' | 'md' | 'lg';
  lineHeight: 'compact' | 'normal' | 'spacious';
  pagePadding: 'compact' | 'normal' | 'spacious';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  itemSpacing: 'compact' | 'normal' | 'spacious';
  headingStyle: 'default' | 'underline' | 'uppercase' | 'colored-bg' | 'border-left';
  layout: '1-column' | '2-column';
  sectionOrder: string[];
  sidebarSections: string[];
  mainSections: string[];
  columnRatio: '1/3-2/3' | '1/2-1/2' | '2/3-1/3';
  accentColor: string;
  textColor: string;
  bgColor: string;
  showIcons: boolean;
  showDates: boolean;
}

export interface ResumeState {
  title: string;
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
  projects: Project[];
  certifications: Certification[];
  template: string;
  templateColor: string;
  customization: CustomizationSettings;
  updateTitle: (title: string) => void;
  updatePersonalInfo: (data: Partial<ResumeState['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  updateSkills: (category: 'technical' | 'soft' | 'languages', values: string[]) => void;
  updateTemplateColor: (color: string) => void;
  updateCustomization: (settings: Partial<CustomizationSettings>) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  setResume: (data: Partial<ResumeState>) => void;
  resetResume: () => void;
}

const defaultCustomization: CustomizationSettings = {
  fontFamily: 'inter',
  fontSize: 'sm',
  lineHeight: 'normal',
  pagePadding: 'normal',
  sectionSpacing: 'normal',
  itemSpacing: 'normal',
  headingStyle: 'default',
  layout: '1-column',
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
  sidebarSections: ['skills', 'certifications'],
  mainSections: ['summary', 'experience', 'education', 'projects'],
  columnRatio: '1/3-2/3',
  accentColor: '#0d9488',
  textColor: '#1f2937',
  bgColor: '#ffffff',
  showIcons: true,
  showDates: true,
};

const defaultState = {
  title: 'Untitled Resume',
  personalInfo: { fullName: '', email: '', phone: '', address: '', linkedin: '', github: '', portfolio: '' },
  summary: '',
  education: [],
  experience: [],
  skills: { technical: [], soft: [], languages: [] },
  projects: [],
  certifications: [],
  template: 'modern',
  templateColor: '#0d9488',
  customization: defaultCustomization,
};

export const useResumeStore = create<ResumeState>((set) => ({
  ...defaultState,

  updateTitle: (title) => set({ title }),
  updatePersonalInfo: (data) => set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),
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
  reorderExperience: (startIndex, endIndex) => set((state) => {
    const newExperience = [...state.experience];
    const [movedItem] = newExperience.splice(startIndex, 1);
    newExperience.splice(endIndex, 0, movedItem);
    return { experience: newExperience };
  }),

  addEducation: () => set((state) => ({
    education: [...state.education, { id: crypto.randomUUID(), school: '', degree: '', startDate: '', endDate: '', grade: '' }]
  })),
  updateEducation: (id, data) => set((state) => ({
    education: state.education.map(edu => edu.id === id ? { ...edu, ...data } : edu)
  })),
  removeEducation: (id) => set((state) => ({
    education: state.education.filter(edu => edu.id !== id)
  })),
  reorderEducation: (startIndex, endIndex) => set((state) => {
    const newEducation = [...state.education];
    const [movedItem] = newEducation.splice(startIndex, 1);
    newEducation.splice(endIndex, 0, movedItem);
    return { education: newEducation };
  }),

  updateSkills: (category, values) => set((state) => ({
    skills: { ...state.skills, [category]: values }
  })),

  updateTemplateColor: (color) => set((state) => ({
    templateColor: color,
    customization: { ...state.customization, accentColor: color }
  })),

  updateCustomization: (data) => set((state) => ({
    customization: { ...state.customization, ...data }
  })),

  addProject: () => set((state) => ({
    projects: [...state.projects, { id: crypto.randomUUID(), name: '', description: '', technologies: '', githubLink: '' }]
  })),
  updateProject: (id, data) => set((state) => ({
    projects: state.projects.map((p: any) => p.id === id ? { ...p, ...data } : p)
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p: any) => p.id !== id)
  })),

  addCertification: () => set((state) => ({
    certifications: [...state.certifications, { id: crypto.randomUUID(), name: '', organization: '', date: '' }]
  })),
  updateCertification: (id, data) => set((state) => ({
    certifications: state.certifications.map((c: any) => c.id === id ? { ...c, ...data } : c)
  })),
  removeCertification: (id) => set((state) => ({
    certifications: state.certifications.filter((c: any) => c.id !== id)
  })),

  setResume: (data) => set((state) => {
    // Merge customization properly if it exists in data
    const customization = data.customization
      ? { ...state.customization, ...data.customization }
      : state.customization;
    return { ...state, ...data, customization };
  }),
  resetResume: () => set({ ...defaultState }),
}));
