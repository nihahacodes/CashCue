import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../firebase";

export function useAuth() {
  const [user,    setUser]    = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);   // null if signed out, object if signed in
      setLoading(false);
    });
    return () => unsub();      // cleanup on unmount
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged above will fire and update user automatically
    } catch (err) {
      // user closed popup or other error
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    // onAuthStateChanged will fire and set user to null
  };

  return { user, loading, error, signInWithGoogle, signOutUser };
}
