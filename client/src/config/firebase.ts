import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBvNsGgMRtmMu_xDoJzmeZ1MOx7XUbodwo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ai-resume-4900a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ai-resume-4900a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ai-resume-4900a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '243101714648',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:243101714648:web:0e882b779fb829a38c6fad',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-5CJE2F1L3H'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebookPopup = () => signInWithPopup(auth, facebookProvider);

export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const signInWithFacebookRedirect = () => signInWithRedirect(auth, facebookProvider);
export const checkRedirectResult = () => getRedirectResult(auth);


export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Could not clear existing recaptchaVerifier:', e);
    }
    (window as any).recaptchaVerifier = null;
  }

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  });
  (window as any).recaptchaVerifier = verifier;
  return verifier;
};

export const isFirebaseConfigured = (): boolean => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(key && key !== 'demo-api-key' && key.trim() !== '');
};

export const sendPhoneOtp = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

