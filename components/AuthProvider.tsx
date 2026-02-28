'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, storage } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, firstName?: string, lastName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => { },
  logout: async () => { },
  signInWithEmail: async () => { },
  signUpWithEmail: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!auth); // If auth is null, we are not loading

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          // Initialize profile for new users immediately so they get starter hints
          const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
          const db = getFirestore();
          const userRef = doc(db, 'profiles', user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              user_id: user.uid,
              username: user.displayName || 'Anonymous Agent',
              email: user.email || '',
              total_score: 0,
              aura_points: 0,
              games_played: 0,
              games_won: 0,
              coins: 0,
              hints: 5, // Starter free hints!
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Failed to initialize user profile", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Error signing in with Email', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, firstName?: string, lastName?: string) => {
    if (!auth) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;

      const displayName = `${firstName || ''} ${lastName || ''}`.trim() || 'New Agent';

      // Dynamic import for updateProfile
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(newUser, {
        displayName,
        photoURL: null
      });

      // Force a reload to get the updated user profile in state
      await newUser.reload();
      setUser({ ...newUser }); // Trigger state update

    } catch (error) {
      console.error('Error signing up with Email', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, signInWithEmail, signUpWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
}
