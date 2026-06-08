import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ─── Paste YOUR Firebase config object here ───────────────────────────────────
// Get it from: Firebase Console → Project Settings → Your apps → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyBVTVXQLpF4O6yaJUx-V6LqTtYkfZV66co",
  authDomain: "wallet-82b23.firebaseapp.com",
  projectId: "wallet-82b23",
  storageBucket: "wallet-82b23.firebasestorage.app",
  messagingSenderId: "484672639353",
  appId: "1:484672639353:web:eba3697b99766a5e839fa8"
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();
