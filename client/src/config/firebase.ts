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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo'
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

export const sendPhoneOtp = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
