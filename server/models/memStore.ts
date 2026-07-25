import mongoose from 'mongoose';

export interface MemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  plan: 'free' | 'premium';
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
  findUserByEmail: (email: string) => memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()),
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
    const now = new Date().toISOString();
    const newResume: MemResume = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId,
      title: data.title || 'Untitled Resume',
      personalInfo: data.personalInfo || {},
      summary: data.summary || '',
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || { technical: [], soft: [], languages: [] },
      projects: data.projects || [],
      certifications: data.certifications || [],
      template: data.template || 'modern',
      templateColor: data.templateColor || '#0d9488',
      customization: data.customization || {},
      createdAt: now,
      updatedAt: now,
    };
    memoryResumes.unshift(newResume);
    return newResume;
  },
  updateResume: (id: string, userId: string, data: any): MemResume | null => {
    const index = memoryResumes.findIndex(r => r._id === id && r.userId === userId);
    if (index === -1) return null;
    memoryResumes[index] = {
      ...memoryResumes[index],
      ...data,
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
