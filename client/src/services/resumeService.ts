import api from './api';

export interface ResumeData {
  _id: string;
  title: string;
  template?: string;
  templateColor?: string;
  updatedAt?: string | number;
  personalInfo?: Record<string, any>;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: any;
  projects?: any[];
  certifications?: any[];
  customization?: any;
  [key: string]: any;
}

export const resumeService = {
  // Get all resumes for user (MongoDB Express API + LocalStorage fallback)
  async getUserResumes(): Promise<ResumeData[]> {
    let mongoResumes: ResumeData[] = [];
    try {
      const res = await api.get('/api/resumes');
      if (Array.isArray(res.data)) {
        mongoResumes = res.data;
      }
    } catch (err) {
      console.warn('MongoDB API fetch failed, falling back to local storage:', err);
    }

    // Merge local storage resumes
    const localResumes: ResumeData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('resume_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data._id) localResumes.push(data);
        } catch (e) {}
      }
    }

    const mongoIds = new Set(mongoResumes.map(r => r._id));
    const onlyLocal = localResumes.filter(r => !mongoIds.has(r._id));

    return [...mongoResumes, ...onlyLocal];
  },

  // Get single resume by ID
  async getResumeById(resumeId: string): Promise<ResumeData | null> {
    const localData = localStorage.getItem(`resume_${resumeId}`);
    if (localData && (resumeId.startsWith('local_') || !navigator.onLine)) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    if (!resumeId.startsWith('local_')) {
      try {
        const res = await api.get(`/api/resumes/${resumeId}`);
        if (res.data) {
          localStorage.setItem(`resume_${resumeId}`, JSON.stringify(res.data));
          return res.data;
        }
      } catch (err) {
        console.warn('MongoDB API load failed:', err);
      }
    }

    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return null;
  },

  // Save or Update a resume in MongoDB
  async saveResume(resumeId: string | undefined, payload: Partial<ResumeData>): Promise<string> {
    const localId = resumeId || `local_${Date.now()}`;
    const resumeToSave = {
      ...payload,
      _id: localId,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`resume_${localId}`, JSON.stringify(resumeToSave));

    try {
      if (resumeId && !resumeId.startsWith('local_')) {
        const res = await api.put(`/api/resumes/${resumeId}`, payload);
        const saved = res.data;
        localStorage.setItem(`resume_${saved._id}`, JSON.stringify(saved));
        return saved._id;
      } else {
        const res = await api.post('/api/resumes', payload);
        const saved = res.data;
        localStorage.removeItem(`resume_${localId}`);
        localStorage.setItem(`resume_${saved._id}`, JSON.stringify(saved));
        return saved._id;
      }
    } catch (err) {
      console.warn('MongoDB API save failed, kept in local storage:', err);
      return localId;
    }
  },

  // Delete a resume from MongoDB
  async deleteResume(resumeId: string): Promise<void> {
    localStorage.removeItem(`resume_${resumeId}`);

    if (!resumeId.startsWith('local_')) {
      try {
        await api.delete(`/api/resumes/${resumeId}`);
      } catch (err) {
        console.warn('MongoDB API delete failed:', err);
      }
    }
  },

  // Duplicate a resume in MongoDB
  async duplicateResume(resume: ResumeData): Promise<ResumeData> {
    const { _id: _1, userId: _2, createdAt: _3, updatedAt: _4, __v: _5, ...resumeData } = resume;
    const payload = {
      ...resumeData,
      title: `${resume.title || 'Resume'} (Copy)`
    };

    try {
      const res = await api.post('/api/resumes', payload);
      const saved = res.data;
      localStorage.setItem(`resume_${saved._id}`, JSON.stringify(saved));
      return saved;
    } catch (err) {
      console.warn('MongoDB API duplicate failed, creating local copy:', err);
      const newId = `local_${Date.now()}`;
      const duplicated: ResumeData = {
        ...payload,
        _id: newId,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`resume_${newId}`, JSON.stringify(duplicated));
      return duplicated;
    }
  }
};
