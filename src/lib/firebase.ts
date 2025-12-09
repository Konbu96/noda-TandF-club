import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpE6vV5S3cdHUZI3jsvQcOfM6EOrTkF44",
  authDomain: "noda-tandf-club.firebaseapp.com",
  projectId: "noda-tandf-club",
  storageBucket: "noda-tandf-club.firebasestorage.app",
  messagingSenderId: "230143359362",
  appId: "1:230143359362:web:7e65f02e90a29a692d779b"
};

// Firebase appが既に初期化されている場合は再利用
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

