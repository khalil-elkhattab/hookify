'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/configs/firebaseConfig";
// --- إضافات Convex ---
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // استدعاء وظيفة الحفظ من Convex
  const createUser = useMutation(api.user.createOrUpdateUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // --- الجزء السحري لإضافة المستخدم لـ Convex ---
      if (currentUser) {
        try {
          await createUser({
            name: currentUser.displayName || "User",
            email: currentUser.email,
            imageUrl: currentUser.photoURL || "",
          });
          console.log("User synced with Convex successfully!");
        } catch (error) {
          console.error("Error syncing user with Convex:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [createUser]);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);