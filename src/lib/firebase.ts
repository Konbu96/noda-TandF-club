import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAgCxo1tff9eM7umLfpTuD9Akhwrf-zBc",
  authDomain: "noda-trackandfieldclub.firebaseapp.com",
  projectId: "noda-trackandfieldclub",
  storageBucket: "noda-trackandfieldclub.firebasestorage.app",
  messagingSenderId: "993043863758",
  appId: "1:993043863758:web:35f5a61599ebe2add2989f",
};

// Firebase appが既に初期化されている場合は再利用
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

