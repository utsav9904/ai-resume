import { db, auth } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

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

const getUserId = (providedUserId?: string): string => {
  return providedUserId || auth.currentUser?.uid || 'guest_user';
};

export const resumeService = {
  // Get all resumes for a user
  async getUserResumes(userId?: string): Promise<ResumeData[]> {
    const uid = getUserId(userId);
    const cloudResumes: ResumeData[] = [];

    if (uid !== 'guest_user') {
      try {
        const resumesRef = collection(db, 'users', uid, 'resumes');
        const q = query(resumesRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudResumes.push({
            _id: docSnap.id,
            ...data,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
          } as ResumeData);
        });
      } catch (err) {
        console.warn('Firestore fetch failed, falling back to local:', err);
      }
    }

    // Merge with LocalStorage resumes
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

    const cloudIds = new Set(cloudResumes.map(r => r._id));
    const onlyLocal = localResumes.filter(r => !cloudIds.has(r._id));

    return [...cloudResumes, ...onlyLocal];
  },

  // Get single resume by ID
  async getResumeById(resumeId: string, userId?: string): Promise<ResumeData | null> {
    const uid = getUserId(userId);

    // 1. Try local storage first if local ID
    const localData = localStorage.getItem(`resume_${resumeId}`);
    if (localData && (resumeId.startsWith('local_') || !navigator.onLine)) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    // 2. Try Firestore Cloud DB
    if (uid !== 'guest_user' && !resumeId.startsWith('local_')) {
      try {
        const docRef = doc(db, 'users', uid, 'resumes', resumeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const resume = {
            _id: docSnap.id,
            ...data,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
          } as ResumeData;
          // Sync to localStorage
          localStorage.setItem(`resume_${resumeId}`, JSON.stringify(resume));
          return resume;
        }
      } catch (err) {
        console.warn('Firestore load failed:', err);
      }
    }

    // 3. Fallback to LocalStorage
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return null;
  },

  // Save or Update a resume
  async saveResume(resumeId: string | undefined, payload: Partial<ResumeData>, userId?: string): Promise<string> {
    const uid = getUserId(userId);
    const targetId = resumeId || `resume_${Date.now()}`;

    const resumeToSave = {
      ...payload,
      _id: targetId,
      updatedAt: new Date().toISOString()
    };

    // Save to LocalStorage immediately
    localStorage.setItem(`resume_${targetId}`, JSON.stringify(resumeToSave));

    // Save to Firestore Cloud DB if user is logged in
    if (uid !== 'guest_user') {
      try {
        const docRef = doc(db, 'users', uid, 'resumes', targetId);
        await setDoc(docRef, {
          ...payload,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore cloud save failed, kept in local storage:', err);
      }
    }

    return targetId;
  },

  // Delete a resume
  async deleteResume(resumeId: string, userId?: string): Promise<void> {
    const uid = getUserId(userId);

    // Remove from LocalStorage
    localStorage.removeItem(`resume_${resumeId}`);

    // Remove from Firestore
    if (uid !== 'guest_user' && !resumeId.startsWith('local_')) {
      try {
        const docRef = doc(db, 'users', uid, 'resumes', resumeId);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('Firestore delete failed:', err);
      }
    }
  },

  // Duplicate a resume
  async duplicateResume(resume: ResumeData, userId?: string): Promise<ResumeData> {
    const uid = getUserId(userId);
    const newId = `resume_${Date.now()}`;
    const { _id, ...rest } = resume;

    const duplicated: ResumeData = {
      ...rest,
      _id: newId,
      title: `${resume.title || 'Resume'} (Copy)`,
      updatedAt: new Date().toISOString()
    };

    await this.saveResume(newId, duplicated, uid);
    return duplicated;
  }
};
