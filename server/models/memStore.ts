import mongoose from 'mongoose';

export interface MemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  plan: 'free' | 'premium';
  firebaseUid?: string;
  phoneNumber?: string;
}

export interface MemResume {
  _id: string;
  userId: string;
  title: string;
  personalInfo?: any;
  summary?: string;
  education?: any[];
  experience?: any[];
  skills?: any;
  projects?: any[];
  certifications?: any[];
  template?: string;
  templateColor?: string;
  customization?: any;
  createdAt?: string;
  updatedAt?: string;
}

const memoryUsers: MemUser[] = [];
const memoryResumes: MemResume[] = [];

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const memDb = {
  // Users
  findUserByEmail: (email: string) => {
    if (!email) return undefined;
    return memoryUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: (id: string) => memoryUsers.find(u => u.id === id),
  createUser: (userData: { name: string; email: string; password?: string; plan?: 'free' | 'premium' }): MemUser => {
    const newUser: MemUser = {
      id: new mongoose.Types.ObjectId().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      plan: userData.plan || 'free',
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  // Resumes
  getResumesByUser: (userId: string) => memoryResumes.filter(r => r.userId === userId),
  getResumeById: (id: string) => memoryResumes.find(r => r._id === id),
  createResume: (userId: string, data: any): MemResume => {
    const safeData = data || {};
    const now = new Date().toISOString();
    const newResume: MemResume = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId,
      title: safeData.title || 'Untitled Resume',
      personalInfo: safeData.personalInfo || {},
      summary: safeData.summary || '',
      education: safeData.education || [],
      experience: safeData.experience || [],
      skills: safeData.skills || { technical: [], soft: [], languages: [] },
      projects: safeData.projects || [],
      certifications: safeData.certifications || [],
      template: safeData.template || 'modern',
      templateColor: safeData.templateColor || '#0d9488',
      customization: safeData.customization || {},
      createdAt: now,
      updatedAt: now,
    };
    memoryResumes.unshift(newResume);
    return newResume;
  },
  updateResume: (id: string, userId: string, data: any): MemResume | null => {
    const index = memoryResumes.findIndex(r => r._id === id && r.userId === userId);
    if (index === -1) return null;
    const safeData = data || {};
    const existing = memoryResumes[index];
    memoryResumes[index] = {
      ...existing,
      ...safeData,
      _id: existing._id,
      userId: existing.userId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    return memoryResumes[index];
  },
  deleteResume: (id: string, userId: string): boolean => {
    const index = memoryResumes.findIndex(r => r._id === id && r.userId === userId);
    if (index === -1) return false;
    memoryResumes.splice(index, 1);
    return true;
  }
};
