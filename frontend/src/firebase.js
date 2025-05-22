// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API}`,
  authDomain: "plantique-login.firebaseapp.com",
  projectId: "plantique-login",
  storageBucket: "plantique-login.firebasestorage.app",
  messagingSenderId: "875112469461",
  appId: "1:875112469461:web:4b7fc267df2df398dae35c",
  measurementId: "G-YVDELPS91N",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
