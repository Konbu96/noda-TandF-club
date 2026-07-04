import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDAgCxo1tff9eM7umLfpTuD9Akhwrf-zBc",
  authDomain: "noda-trackandfieldclub.firebaseapp.com",
  projectId: "noda-trackandfieldclub",
  storageBucket: "noda-trackandfieldclub.firebasestorage.app",
  messagingSenderId: "993043863758",
  appId: "1:993043863758:web:35f5a61599ebe2add2989f",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

