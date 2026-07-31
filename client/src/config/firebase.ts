import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';

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

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebookPopup = () => signInWithPopup(auth, facebookProvider);

export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  if ((window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier.clear();
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

