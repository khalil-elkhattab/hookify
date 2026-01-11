'use client';

import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { Button } from "./ui/button";

export default function Authentication({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (loading) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } 
    catch (error) { console.error(error); }
    setLoading(false);
  };

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try { await signOut(auth); } 
    catch (error) { console.error(error); }
    setLoading(false);
  };

  return (
    <Button
      onClick={user ? logout : login}
      disabled={loading}
      className={`px-12 py-4 rounded-full font-extrabold text-lg
                  transition transform hover:scale-105
                  ${user ? "bg-red-600 text-white hover:bg-red-700" : "bg-white text-red-600 hover:bg-gray-100"}`}
    >
      {user ? "Logout" : children}
    </Button>
  );
}
