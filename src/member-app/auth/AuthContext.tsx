'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserRole } from '@/lib/users';

const ADMIN_EMAIL = 'hajime1129okamoto@gmail.com';

type AuthContextType = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const stored = (snap.data().role as UserRole | null) ?? null;
            if (firebaseUser.email === ADMIN_EMAIL && stored !== 'teacher') {
              await updateDoc(userRef, { role: 'teacher' });
              setRole('teacher');
            } else {
              setRole(stored);
            }
          } else {
            const defaultRole: UserRole | null = firebaseUser.email === ADMIN_EMAIL ? 'teacher' : null;
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: defaultRole,
            });
            setRole(defaultRole);
          }
        } catch (e) {
          console.error('Firestore error:', e);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
